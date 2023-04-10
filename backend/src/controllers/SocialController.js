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

const notifyUser = async (reqUser, recUser, type, payload) => {
  await Models.Notification.create({
    data: {
      type: type,
      data: { sender: reqUser, payload: payload },
      users: {
        connect: {
          id: recUser,
        },
      },
    },
  });
};

const friendRequestHandler = expressAsyncHandler(async (req, res) => {
  const user = await UserController.findUser(req.params.id);
  const responseUser = req.body._id;
  const receiveUser = user.id;
  var friendStatus = 'not';
  var msg;
  var type;
  const flag = await isFriend(receiveUser, responseUser);

  if (user) {
    if (req.params.reply == 'accept') {
      if (flag == 'requesting') {
        await changeFriendStatus(responseUser, receiveUser, 'friend');
        await changeFriendStatus(receiveUser, responseUser, 'friend');
        friendStatus = 'friend';
        msg = 'Friend Request Accepted! You are now friend';
        type = notificationType.FRIEND_ADD;
      } else {
        res.send({
          message: `You're friend have withdraw request`,
          status: friendStatus,
        });
        return;
      }
    }
    if (req.params.reply == 'decline') {
      await deleteFriendStatus(responseUser, receiveUser);
      msg = 'You have decline request!';
      type = notificationType.FRIEND_DELETE;
    }
    if (req.params.reply == 'cancel') {
      await deleteFriendStatus(responseUser, receiveUser);
      if (flag == 'requested') {
        await deleteFriendStatus(receiveUser, responseUser);
      }
      msg = 'You have cancel request!';
      type = notificationType.FRIEND_DELETE;
    }
    await notifyUser(responseUser, receiveUser, type, req.body.payload);
    console.log(friendStatus);
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

  if (user) {
    await addToFriendList(requestUser, receiveUser, SocialStatus.requesting);
    await addToFriendList(receiveUser, requestUser, SocialStatus.requested);
    await notifyUser(requestUser, receiveUser, req.body.type, req.body.payload);

    res.send({ message: 'Invite Sent', state: 'requesting' });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

export {
  requestFriend,
  getFriendListID,
  isFriend,
  friendRequestHandler,
  getFriendStatus,
};
