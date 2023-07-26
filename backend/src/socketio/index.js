import { Server } from 'socket.io';
import registerNotificationHandlers from './notificationHandler.js';
import crypto from 'crypto';
import { Models } from '../models/prismaDB.js';

const initSocket = (httpServer) => {
  const randomId = () => crypto.randomBytes(8).toString('hex');
  const SessionStore = Models.SessionStore;

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      medthods: ['GET', 'PUT', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  });
  // Socket.IO

  //Middleware
  io.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      // find existing session
      const session = await SessionStore.findUnique({
        where: { sessionID: sessionID },
      });

      if (session) {
        socket.sessionID = sessionID;
        socket.userId = session.userId;
        socket.userName = session.userName;
        return next();
      }
    }
    const username = socket.handshake.auth.userName;
    if (!username) {
      return next(new Error('invalid username'));
    }
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error('invalid User'));
    }
    // create new session
    socket.userId = userId;
    socket.sessionID = randomId();
    socket.userName = username;
    next();
  });

  const onConnection = async (socket) => {
    // persist session
    await SessionStore.upsert({
      update: {
        connected: true,
        sessionID: socket.sessionID,
      },
      where: { userId: socket.userId },
      create: {
        sessionID: socket.sessionID,
        userId: socket.userId,
        userName: socket.userName,
        connected: true,
      },
    });
    // const users = [];
    // SessionStore.findMany().forEach((session) => {
    //   users.push({
    //     userId: session.userId,
    //     userName: session.userName,
    //     connected: session.connected,
    //   });
    // });
    // send session details
    socket.emit('session', {
      sessionID: socket.sessionID,
      userId: socket.userID,
    });
    // join the "userID" room

    socket.join(socket.userId);

    // send active user
    // socket.emit('users', users);

    registerNotificationHandlers(io, socket);
    // registerUserHandlers(io, socket);
    socket.on('disconnect', async () => {
      const matchingSockets = await io.in(socket.userId).fetchSockets();
      const isDisconnected = matchingSockets.length === 0;
      if (isDisconnected) {
        // notify other users
        socket.broadcast.emit('user disconnected', socket.userID);
        // update the connection status of the session
        await SessionStore.update({
          data: {
            connected: false,
          },
          where: { userId: socket.userId },
        });
      }
    });
  };

  io.on('connection', onConnection);
};

export default initSocket;
