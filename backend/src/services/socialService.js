import User from '../models/User.js';
import * as userService from '../services/userService.js';
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

const getFriendCount = async (listID) => {
  const friendCount = await Models.FriendList.findUnique({
    where: { id: listID },
    select: {
      friends: true,
    },
  });
  return friendCount.length || 0;
};

const getFriend = async (listID) => {
  const friends = Models.Friends.findMany({
    where: { listID: listID, status: SocialStatus.friend },
    take: 5,
    select: {
      users: {
        select: {
          id: true,
          name: true,
          profile: true,
        },
      },
    },
  });
  return friends;
};
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

const getAllNotification = async (reqUser) => {
  const notiList = await Models.Notification.findMany({
    where: { userID: reqUser },
    select: {
      id: true,
      type: true,
      data: true,
      users: true,
      date: true,
      isViewed: true,
    },
  });
  return notiList;
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

export {
  addToFriendList,
  getFriendListID,
  isFriend,
  changeFriendStatus,
  deleteFriendStatus,
  createNotification,
  updateNotification,
  getAllNotification,
  getFriendCount,
  getFriend,
};
