import { Models } from '../src/models/prismaDB.js';

const getUserNotification = async (userId) => {
  const notiList = await Models.Notification.findMany({
    where: { userID: userId },
    select: {
      type: true,
      data: true,
      users: true,
    },
  });
  return notiList;
};

const registerNotificationHandlers = (io, socket) => {
  console.log(socket.userId);
  const readNotification = async (userId) => {
    const notiList = await getUserNotification(userId);
    io.emit('notify:read', notiList);
  };
  socket.on('notify:read', readNotification);
};

export default registerNotificationHandlers;
