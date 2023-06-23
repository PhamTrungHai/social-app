import User from '../models/User.js';

const getUserInfo = async (userId) => {
  const UserInfo = await User.findById(userId);
  return UserInfo;
};

const registerNotificationHandlers = (io, socket) => {
  // const readNotification = async (userId) => {
  //   const notiList = await getUserNotification(userId);
  //   io.emit('notify:read', notiList);
  // };
  const createNotification = async (userId, type, date) => {
    const user = await getUserInfo(socket.userId);
    io.to(userId).emit(
      'notify:receive',
      {
        id: user.id,
        name: user.name,
        avatar: user.profile.avatarURL,
      },
      type,
      date
    );
  };

  // socket.on('notify:read', readNotification);
  socket.on('notify:create', createNotification);
};

export default registerNotificationHandlers;
