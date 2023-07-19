import { Models } from '../models/prismaDB.js';
import { SocialStatus } from '../utils/Enum.js';

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
      Friends: {
        select: {
          id: true,
        },
      },
    },
  });
  console.log(friendCount);
  return friendCount.Friends.length || 0;
};

const getFriendByAmount = async (listID, amount) => {
  const friends = Models.Friends.findMany({
    where: { listID: listID, status: SocialStatus.friend },
    take: amount,
    select: {
      Users: {
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

const getFriendStatus = async (listID) => {
  return await Promise.all([
    getFriendCount(listID),
    getFriendByAmount(listID, 5),
  ]);
};

const isFriend = async (userId, friendId) => {
  const listID = await getFriendListID(userId);
  const friend = await Models.prisma
    .$queryRaw`SELECT * FROM "Friends" WHERE "listID" = ${listID} AND "userID"=${friendId};`;
  return friend[0] ? friend[0].status : 'not';
};

const addToFriendList = async (sendID, receiveID) => {
  const [senderList, receiveList] = await Promise.all([
    getFriendListID(sendID),
    getFriendListID(receiveID),
  ]);
  await Promise.all([
    Models.Friends.create({
      data: {
        FriendList: {
          connect: {
            id: senderList,
          },
        },
        Users: {
          connect: {
            id: receiveID,
          },
        },
        SocialStatus: {
          connect: {
            name: SocialStatus.requesting,
          },
        },
      },
    }),
    Models.Friends.create({
      data: {
        FriendList: {
          connect: {
            id: receiveList,
          },
        },
        Users: {
          connect: {
            id: sendID,
          },
        },
        SocialStatus: {
          connect: {
            name: SocialStatus.requested,
          },
        },
      },
    }),
  ]);
  return;
};

const changeFriendStatus = async (sendID, receiveID) => {
  const [senderList, receiveList] = await Promise.all([
    getFriendListID(sendID),
    getFriendListID(receiveID),
  ]);
  const [sender, receiver] = await Promise.all([
    Models.prisma
      .$queryRaw`UPDATE "Friends" SET "status"=${SocialStatus.friend} WHERE "listID" = ${senderList} AND "userID"=${receiveID} RETURNING *;`,
    Models.prisma
      .$queryRaw`UPDATE "Friends" SET "status"=${SocialStatus.friend} WHERE "listID" = ${receiveList} AND "userID"=${sendID} RETURNING *;`,
  ]);
  return;
};

const deleteFriendStatus = async (sendID, receiveID) => {
  const listID = await getFriendListID(sendID);
  await Models.prisma
    .$queryRaw`DELETE FROM "Friends" WHERE "listID" = ${listID} AND "userID"=${receiveID};`;
  return 'not';
};

export {
  addToFriendList,
  getFriendListID,
  isFriend,
  changeFriendStatus,
  deleteFriendStatus,
  getFriendCount,
  getFriendByAmount,
  getFriendStatus,
};
