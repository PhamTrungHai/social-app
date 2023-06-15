import express from 'express';
import multer from 'multer';
import { isAuth } from '../middlewares/authentication.js';
import * as PostController from '../controllers/PostController.js';

const upload = multer();

const postRouter = express.Router();

// /api/posts
postRouter.get('/', isAuth, PostController.getPosts);
postRouter.post(
  '/',
  isAuth,
  upload.single('images'),
  PostController.createPost
);
postRouter.put('/:id', isAuth, PostController.updatePost);
postRouter.delete('/:id', isAuth, PostController.deletePost);
postRouter.get('/:id', isAuth, PostController.getPost);
// /api/posts/:id/like
postRouter.get('/:id/like', isAuth, PostController.getPostLikes);
postRouter.post('/:id/like', isAuth, PostController.likePost);
postRouter.delete('/:id/unlike/:likeId', isAuth, PostController.unlikePost);
// /api/posts/:id/comment
postRouter.post(
  '/:id/comment',
  isAuth,
  upload.single('attachments'),
  PostController.commentPost
);
postRouter.get('/:id/comments', isAuth, PostController.getPostComments);
postRouter.put('/:id/comment/:commentId', isAuth, PostController.updateComment);
postRouter.delete(
  '/:id/comment/:commentId',
  isAuth,
  PostController.deleteComment
);

export default postRouter;
