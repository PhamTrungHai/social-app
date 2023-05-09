import express from 'express';
import { isAuth } from '../middlewares/authentication.js';
import * as SocialController from '../controllers/SocialController.js';

const socialRouter = express.Router();

socialRouter.get('/:id', SocialController.getFriendStatus);
socialRouter.get('/notify/:id', SocialController.getUserNotification);
socialRouter.post('/:id', isAuth, SocialController.requestFriend);
socialRouter.patch(
  '/notify/:id',
  isAuth,
  SocialController.updateNotificationStatus
);
socialRouter.put(
  '/response/:id',
  isAuth,
  SocialController.friendRequestHandler
);
export default socialRouter;
