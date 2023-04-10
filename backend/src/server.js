import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import './config/index.js';
import { setHeader } from './middlewares/authentication.js';
import userRouter from './routes/userRouter.js';
import uploadRouter from './routes/uploadRouter.js';
import socialRouter from './routes/socialRouter.js';
import registerNotificationHandlers from '../socketio/notificationHandler.js';

dotenv.config();
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

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error('invalid User'));
  }
  // create new session
  socket.userId = userId;
  socket.sessionID = userId;
  socket.userID = userId;
  socket.username = username;
  next();
});
const onConnection = (socket) => {
  const users = [];
  for (let [id, socket] of io.of('/').sockets) {
    users.push({
      socketId: id,
      userId: socket.userId,
    });
  }
  socket.emit('session', {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  socket.emit('users', users);
  registerNotificationHandlers(io, socket);
  // registerUserHandlers(io, socket);
};

io.on('connection', onConnection);

//CONFIG APP
app.use((req, res, next) => setHeader(req, res, next));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*---------------------------------->*/
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/social', socialRouter);

//HANDLER ERROR
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(port);
});
