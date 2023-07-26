import * as userService from '../services/userService.js';
import * as socialService from '../services/socialService.js';
import * as notificationService from '../services/notificationService.js';
import expressAsyncHandler from 'express-async-handler';
import { SocialStatus, notificationType } from '../utils/Enum.js';
import { isValidObjectId } from 'mongoose';

const getUserNotification = expressAsyncHandler(async (req, res) => {
  const notiList = await notificationService.getAllNotification(req.params.id);
  res.status(200).send(notiList);
});

const getFriendStatus = expressAsyncHandler(async (req, res) => {
  let id = req.params.id;
  !isValidObjectId(id)
    ? (id = await userService.getUserID(id))
    : console.log('id', id);
  const listID = await socialService.getFriendListID(id);
  const [friendCount, friends] = await socialService.getFriendStatus(listID);
  res.send({ count: friendCount, friends: friends });
});

const friendRequestHandler = expressAsyncHandler(async (req, res) => {
  const userID = await userService.getUserID(req.params.id);
  const responseUser = req.body._id;
  const date = req.body.date;
  const receiveUser = userID;
  const reply = req.body.reply;
  let friendStatus;
  let msg;
  let type = req.body.type;
  const flag = await socialService.isFriend(receiveUser, responseUser);

  if (userID) {
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
  const userID = await userService.getUserID(req.params.id);
  const requestUser = req.body._id;
  const receiveUser = userID;
  const date = new Date(req.body.date);

  if (userID) {
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
