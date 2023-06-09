import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import './config/index.js';
import { setHeader } from './middlewares/authentication.js';
import userRouter from './routes/userRouter.js';
import uploadRouter from './routes/uploadRouter.js';
import postRouter from './routes/postRouter.js';
import socialRouter from './routes/socialRouter.js';
import registerNotificationHandlers from '../socketio/notificationHandler.js';
import crypto from 'crypto';
import { Models } from './models/prismaDB.js';

dotenv.config();
const randomId = () => crypto.randomBytes(8).toString('hex');
const SessionStore = Models.SessionStore;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
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
    console.log('matchingSockets', matchingSockets.length);
    const isDisconnected = matchingSockets.length === 0;
    console.log('isDisconnected', isDisconnected);
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

//CONFIG APP
app.use((req, res, next) => setHeader(req, res, next));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*---------------------------------->*/
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/posts', postRouter);
app.use('/api/social', socialRouter);

//HANDLER ERROR
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(port);
});
