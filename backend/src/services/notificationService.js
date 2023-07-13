import User from '../models/User';
import { Models } from '../models/prismaDB';

const getAllNotification = async (reqUser) => {
  const notiList = await Models.Notification.findMany({
    where: { userID: reqUser },
    select: {
      id: true,
      type: true,
      data: true,
      Users: true,
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
      Users: {
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

const markViewedNotification = async (notiArray) => {
  const promiseArray = notiArray.map(
    async (item) =>
      await Models.Notification.update({
        where: { id: item.id },
        data: { isViewed: true },
      })
  );
  await Promise.all(promiseArray);
  return;
};
export {
  createNotification,
  updateNotification,
  getAllNotification,
  markViewedNotification,
};
