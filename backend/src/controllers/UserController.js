import expressAsyncHandler from 'express-async-handler';
import {
  isAuth,
  isAdmin,
  generateToken,
} from '../middlewares/authentication.js';
import bcrypt from 'bcryptjs';

import { isFriend } from '../services/socialService.js';
import * as userService from '../services/userService.js';

const signIn = expressAsyncHandler(async (req, res) => {
  const user = await userService.getUserByQuery({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.pswd, user.password)) {
      res.status(200).send({
        _id: user.id,
        name: user.name,
        email: user.email,
        slug: user.slug,
        avatarURL: user.profile.avatarURL,
        coverURL: user.profile.coverURL,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: 'invalid email or password' });
});

const signUp = expressAsyncHandler(async (req, res) => {
  const slug = userService.createUserSlug(req.body.email);
  const user = await userService.createUser(
    req.body.name,
    req.body.email,
    req.body.pswd,
    slug
  );
  res.status(201).send({
    _id: user.id,
    name: user.name,
    email: user.email,
    slug: user.slug || user.id,
    avatarURL: user.profile.avatarURL,
    coverURL: user.profile.coverURL,
    token: generateToken(user),
  });
});

const editProfile = expressAsyncHandler(async (req, res) => {
  const updatedUser = await userService.updatedUserInfo(
    req.params.id,
    req.body.name,
    req.body.email,
    req.body.slug,
    req.body.avatarURL,
    req.body.coverURL
  );
  if (updatedUser) {
    res.status(201).send({
      message: 'User Updated',
      user: {
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        slug: updatedUser.slug || user.id,
        avatarURL: updatedUser.profile.avatarURL,
        coverURL: updatedUser.profile.coverURL,
        token: generateToken(updatedUser),
      },
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

const getUserByID = expressAsyncHandler(async (req, res) => {
  const userBySlug = await userService.getUserByQuery({ slug: req.params.id });
  const user = userBySlug ?? (await userService.getUserByID(req.params.id));
  const checkIsFriend =
    user.id == req.user._id ? 'user' : await isFriend(req.user._id, user.id);

  if (user) {
    res.status(200).send({
      _id: user.id,
      name: user.name,
      email: user.email,
      slug: user.slug || user.id,
      avatarURL: user.profile.avatarURL,
      coverURL: user.profile.coverURL,
      status: checkIsFriend,
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

export { signIn, signUp, editProfile, getUserByID };
