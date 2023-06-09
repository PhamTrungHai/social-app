import express from 'express';
import multer from 'multer';
import { isAuth } from '../middlewares/authentication.js';
import * as PostController from '../controllers/PostController.js';

const upload = multer();

const postRouter = express.Router();

postRouter.get('/', isAuth, PostController.getPosts);
postRouter.post(
  '/',
  isAuth,
  upload.single('images'),
  PostController.createPost
);
export default postRouter;
