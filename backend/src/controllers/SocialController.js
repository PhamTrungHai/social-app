import User from '../models/User.js';
import * as UserController from './UserController.js';
import expressAsyncHandler from 'express-async-handler';
import {
  isAuth,
  isAdmin,
  generateToken,
} from '../middlewares/authentication.js';
import { Models } from '../models/prismaDB.js';
import { SocialStatus, notificationType } from '../utils/Enum.js';

const getFriendListID = async (userId) => {
  const friendList = await Models.FriendList.findUnique({
    where: {
      userID: userId,
    },
    select: { id: true },
  });
  return friendList.id;
};

const getUserNotification = expressAsyncHandler(async (req, res) => {
  const notiList = await Models.Notification.findMany({
    where: { userID: req.params.id },
    select: {
      id: true,
      type: true,
      data: true,
      users: true,
      date: true,
      isViewed: true,
    },
  });
  res.send(notiList);
});

const getFriendStatus = expressAsyncHandler(async (req, res) => {
  const user = await UserController.findUser(req.params.id);
  const listID = await getFriendListID(user.id);
  const friendCount = await Models.prisma.FriendList.findUnique({
    where: { id: listID },
  }).friends();
  const friends = await Models.prisma
    .$queryRaw`SELECT "userID" FROM "Friends" WHERE "listID" = ${listID} AND "status"='friend' FETCH FIRST 5 ROW ONLY;`;
  var friendArr = [];
  async function array() {
    for await (const friend of friends) {
      friendArr.push(await UserController.findUser(friend.userID));
    }
  }
  await array();

  res.send({ count: friendCount.length, friends: friendArr });
});

const isFriend = async (userId, friendId) => {
  const listID = await getFriendListID(userId);
  const friend = await Models.prisma
    .$queryRaw`SELECT * FROM "Friends" WHERE "listID" = ${listID} AND "userID"=${friendId};`;
  return friend[0] ? friend[0].status : 'not';
};

const addToFriendList = async (sendID, receiveID, status) => {
  const listID = await getFriendListID(sendID);
  await Models.Friends.create({
    data: {
      friendList: {
        connect: {
          id: listID,
        },
      },
      users: {
        connect: {
          id: receiveID,
        },
      },
      SocialStatus: {
        connect: {
          name: status,
        },
      },
    },
  });
};

const changeFriendStatus = async (sendID, receiveID, status) => {
  const listID = await getFriendListID(sendID);
  const friend = await Models.prisma
    .$queryRaw`UPDATE "Friends" SET "status"=${status} WHERE "listID" = ${listID} AND "userID"=${receiveID} RETURNING *;`;
  return friend[0].status;
};

const deleteFriendStatus = async (sendID, receiveID) => {
  const listID = await getFriendListID(sendID);
  const friend = await Models.prisma
    .$queryRaw`DELETE FROM "Friends" WHERE "listID" = ${listID} AND "userID"=${receiveID};`;
  return 'not';
};

const createNotification = async (reqUser, recUser, type, payload, date) => {
  const newDate = new Date(date);
  const user = await User.findById(reqUser);
  await Models.Notification.create({
    data: {
      type: type,
      data: {
        sender: {
          id: user.id,
          name: user.name,
          avatar: user.profile.avatarURL,
        },
        payload: payload,
      },
      date: newDate,
      users: {
        connect: {
          id: recUser,
        },
      },
    },
  });
};

const updateNotification = async (reqUser, type, date) => {
  date = new Date(date).toISOString();
  await Models.prisma
    .$queryRaw`UPDATE "Notification" SET "type" = ${type} , "date" = ${date}::timestamptz WHERE "userID" = ${reqUser};`;
};

const friendRequestHandler = expressAsyncHandler(async (req, res) => {
  const user = await UserController.findUser(req.params.id);
  const responseUser = req.body._id;
  const date = req.body.date;
  const receiveUser = user.id;
  const reply = req.body.reply;
  var friendStatus = 'not';
  var msg;
  var type = req.body.type;
  const flag = await isFriend(receiveUser, responseUser);

  if (user) {
    if (reply == 'accept') {
      if (flag == 'requesting') {
        await changeFriendStatus(responseUser, receiveUser, 'friend');
        await changeFriendStatus(receiveUser, responseUser, 'friend');
        friendStatus = 'friend';
        msg = 'Friend Request Accepted! You are now friend';
        type = notificationType.FRIEND_ACCEPTED;
        updateNotification(responseUser, notificationType.FRIEND_ADDED, date);
      } else {
        res.send({
          message: `Your friend have withdraw request`,
          status: friendStatus,
        });
        return;
      }
    }
    if (reply == 'decline') {
      await deleteFriendStatus(responseUser, receiveUser);
      msg = 'You have decline request!';
      type = notificationType.FRIEND_DELETED;
    }
    if (reply == 'cancel') {
      await deleteFriendStatus(responseUser, receiveUser);
      if (flag == 'requested') {
        await deleteFriendStatus(receiveUser, responseUser);
      }
      msg = 'You have cancel request!';
      type = notificationType.FRIEND_DELETED;
    }
    await createNotification(
      responseUser,
      receiveUser,
      type,
      req.body.payload,
      date
    );
    res.send({
      message: msg,
      status: friendStatus,
    });
  }
});

const requestFriend = expressAsyncHandler(async (req, res) => {
  const user = await UserController.findUser(req.params.id);
  const requestUser = req.body._id;
  const receiveUser = user.id;
  const date = new Date(req.body.date);

  if (user) {
    await addToFriendList(requestUser, receiveUser, SocialStatus.requesting);
    await addToFriendList(receiveUser, requestUser, SocialStatus.requested);
    await createNotification(
      requestUser,
      receiveUser,
      req.body.type,
      req.body.payload,
      date
    );

    res.send({ message: 'Invite Sent', state: 'requesting' });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

const updateNotificationStatus = expressAsyncHandler(async (req, res) => {
  const NotificationArray = req.body.notifyArray;
  await NotificationArray.forEach(async (item) => {
    await Models.Notification.update({
      where: { id: item.id },
      data: { isViewed: true },
    });
  });
  res.send({ message: 'No new notifications' });
});

export {
  requestFriend,
  getFriendListID,
  isFriend,
  friendRequestHandler,
  getFriendStatus,
  getUserNotification,
  updateNotificationStatus,
};
