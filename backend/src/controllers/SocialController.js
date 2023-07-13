import * as userService from '../services/userService.js';
import * as socialService from '../services/socialService.js';
import * as notificationService from '../services/notificationService.js';
import expressAsyncHandler from 'express-async-handler';
import { SocialStatus, notificationType } from '../utils/Enum.js';

const getUserNotification = expressAsyncHandler(async (req, res) => {
  const notiList = await notificationService.getAllNotification(req.params.id);
  res.status(200).send(notiList);
});

const getFriendStatus = expressAsyncHandler(async (req, res) => {
  const userBySlug = await userService.getUserByQuery({ slug: req.params.id });
  const user = userBySlug ?? (await userService.getUserByID(req.params.id));
  const listID = await socialService.getFriendListID(user.id);
  const [friendCount, friends] = await socialService.getFriendStatus(listID);
  res.send({ count: friendCount, friends: friends });
});

const friendRequestHandler = expressAsyncHandler(async (req, res) => {
  const user = await userService.getUserByID(req.params.id);
  const responseUser = req.body._id;
  const date = req.body.date;
  const receiveUser = user.id;
  const reply = req.body.reply;
  let friendStatus;
  let msg;
  let type = req.body.type;
  const flag = await socialService.isFriend(receiveUser, responseUser);

  if (user) {
    switch (reply) {
      case 'accept':
        if (flag == SocialStatus.requesting) {
          await socialService.changeFriendStatus(responseUser, receiveUser);
          friendStatus = SocialStatus.friend;
          msg = 'Friend Request Accepted! You are now friend';
          type = notificationType.FRIEND_ACCEPTED;
          notificationService.updateNotification(
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
        break;
      case 'decline':
        await socialService.deleteFriendStatus(responseUser, receiveUser);
        msg = 'You have decline request!';
        type = notificationType.FRIEND_DELETED;
        break;
      case 'cancel':
        await socialService.deleteFriendStatus(responseUser, receiveUser);
        if (flag == SocialStatus.requested) {
          await socialService.deleteFriendStatus(receiveUser, responseUser);
        }
        msg = 'You have cancel request!';
        type = notificationType.FRIEND_DELETED;
        break;
      default:
        friendStatus = 'not';
        break;
    }
    await notificationService.createNotification(
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
  res.status(404).send({ message: 'User Not Found' });
});

const requestFriend = expressAsyncHandler(async (req, res) => {
  const user = await userService.getUserByID(req.params.id);
  const requestUser = req.body._id;
  const receiveUser = user.id;
  const date = new Date(req.body.date);

  if (user) {
    await socialService.addToFriendList(requestUser, receiveUser);
    await notificationService.createNotification(
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
  await notificationService.markViewedNotification(NotificationArray);
  res.send({ message: 'No new notifications' });
});

export {
  requestFriend,
  friendRequestHandler,
  getFriendStatus,
  getUserNotification,
  updateNotificationStatus,
};
