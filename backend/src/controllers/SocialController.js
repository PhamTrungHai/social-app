import * as userService from '../services/userService.js';
import * as socialService from '../services/socialService.js';
import expressAsyncHandler from 'express-async-handler';
import {
  isAuth,
  isAdmin,
  generateToken,
} from '../middlewares/authentication.js';
import { Models } from '../models/prismaDB.js';
import { SocialStatus, notificationType } from '../utils/Enum.js';

const getUserNotification = expressAsyncHandler(async (req, res) => {
  const notiList = await socialService.getAllNotification(req.params.id);
  res.status(200).send(notiList);
});

const getFriendStatus = expressAsyncHandler(async (req, res) => {
  const user = await userService.getOneUser({ id: req.params.id });
  const listID = await socialService.getFriendListID(user.id);
  const [friendCount, friends] = await Promise.all([
    socialService.getFriendCount(listID),
    socialService.getFriend(listID),
  ]);
  res.send({ count: friendCount, friends: friends });
});

const friendRequestHandler = expressAsyncHandler(async (req, res) => {
  const user = await userService.getOneUser(req.params.id);
  const responseUser = req.body._id;
  const date = req.body.date;
  const receiveUser = user.id;
  const reply = req.body.reply;
  var friendStatus = 'not';
  var msg;
  var type = req.body.type;
  const flag = await socialService.isFriend(receiveUser, responseUser);

  if (user) {
    if (reply == 'accept') {
      if (flag == 'requesting') {
        await socialService.changeFriendStatus(
          responseUser,
          receiveUser,
          'friend'
        );
        await socialService.changeFriendStatus(
          receiveUser,
          responseUser,
          'friend'
        );
        friendStatus = 'friend';
        msg = 'Friend Request Accepted! You are now friend';
        type = notificationType.FRIEND_ACCEPTED;
        socialService.updateNotification(
          responseUser,
          notificationType.FRIEND_ADDED,
          date
        );
      } else {
        res.send({
          message: `Your friend have withdraw request`,
          status: friendStatus,
        });
        return;
      }
    }
    if (reply == 'decline') {
      await socialService.deleteFriendStatus(responseUser, receiveUser);
      msg = 'You have decline request!';
      type = notificationType.FRIEND_DELETED;
    }
    if (reply == 'cancel') {
      await socialService.deleteFriendStatus(responseUser, receiveUser);
      if (flag == 'requested') {
        await socialService.deleteFriendStatus(receiveUser, responseUser);
      }
      msg = 'You have cancel request!';
      type = notificationType.FRIEND_DELETED;
    }
    await socialService.createNotification(
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
  const user = await userService.getOneUser({ id: req.params.id });
  const requestUser = req.body._id;
  const receiveUser = user.id;
  const date = new Date(req.body.date);

  if (user) {
    await socialService.addToFriendList(
      requestUser,
      receiveUser,
      SocialStatus.requesting
    );
    await socialService.addToFriendList(
      receiveUser,
      requestUser,
      SocialStatus.requested
    );
    await socialService.createNotification(
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
  friendRequestHandler,
  getFriendStatus,
  getUserNotification,
  updateNotificationStatus,
};
