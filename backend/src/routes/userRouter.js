import express from 'express';
import * as UserController from '../controllers/UserController.js';
import { convertToken, isAuth } from '../middlewares/authentication.js';

const userRouter = express.Router();

userRouter.get('/:id', convertToken, UserController.getUserByID);
userRouter.post('/signin', UserController.signIn);
userRouter.post('/signup', UserController.signUp);
userRouter.put('/:id', isAuth, UserController.editProfile);
export default userRouter;
