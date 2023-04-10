import express from 'express';
import * as UserController from '../controllers/UserController.js';
import { convertToken, isAuth } from '../middlewares/authentication.js';

const userRouter = express.Router();
// userRouter.get(
//   '/',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const users = await User.find({});
//     res.send(users);
//   })
// );

// userRouter.put(
//   '/:id',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;
//       user.isAdmin = Boolean(req.body.isAdmin);
//       const updatedUser = await user.save();
//       res.send({ message: 'User Updated', user: updatedUser });
//     } else {
//       res.status(404).send({ message: 'User Not Found' });
//     }
//   })
// );

// userRouter.delete(
//   '/:id',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (user) {
//       if (user.email === 'admin@example.com') {
//         res.status(400).send({ message: 'Can Not Delete Admin User' });
//         return;
//       }
//       await user.remove();
//       res.send({ message: 'User Deleted' });
//     } else {
//       res.status(404).send({ message: 'User Not Found' });
//     }
//   })
// );

userRouter.get('/:id', convertToken, UserController.getUserByID);
userRouter.post('/signin', UserController.signIn);
userRouter.post('/signup', UserController.signUp);
userRouter.put('/:id', isAuth, UserController.editProfile);
export default userRouter;
