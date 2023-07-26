import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import './config/index.js';

import { setHeader } from './middlewares/authentication.js';
import userRouter from './routes/userRouter.js';
import uploadRouter from './routes/uploadRouter.js';
import postRouter from './routes/postRouter.js';
import socialRouter from './routes/socialRouter.js';
import { Models } from './models/prismaDB.js';
import initSocket from './socketio/index.js';

dotenv.config();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

//CONFIG APP
app.use((req, res, next) => setHeader(req, res, next));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
/*---------------------------------->*/
//ROUTES
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/posts', postRouter);
app.use('/api/social', socialRouter);
/*---------------------------------->*/
//SERVE STATIC ASSETS IF IN PRODUCTION
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/dist/index.html'))
);

//HANDLER ERROR
app.use((err, req, res, next) => {
  Models.prisma.$disconnect();
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(port);
});
