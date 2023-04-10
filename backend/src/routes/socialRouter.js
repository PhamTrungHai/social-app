import express from 'express';
import { isAuth } from '../middlewares/authentication.js';
import * as SocialController from '../controllers/SocialController.js';

const socialRouter = express.Router();

socialRouter.get('/:id', SocialController.getFriendStatus);
socialRouter.put('/:id', isAuth, SocialController.requestFriend);
socialRouter.put(
  '/:id/response/:reply',
  isAuth,
  SocialController.friendRequestHandler
);
export default socialRouter;
