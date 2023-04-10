import User from '../models/User.js';
import expressAsyncHandler from 'express-async-handler';
import {
  isAuth,
  isAdmin,
  generateToken,
} from '../middlewares/authentication.js';
import bcrypt from 'bcryptjs';
import { Models } from '../models/prismaDB.js';
import { isFriend } from './SocialController.js';

const signIn = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.pswd, user.password)) {
      res.send({
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
  const string = new String(req.body.email);
  const slug = string.replace(
    '.com',
    string.charCodeAt(string.lastIndexOf('.'))
  );
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.pswd),
    slug: slug,
  });
  const user = await newUser.save();
  const addUser = async () => {
    await Models.User.create({
      data: {
        id: user.id,
      },
    });
    await Models.FriendList.create({
      data: {
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  };
  await addUser();
  res.send({
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
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.slug = req.body.slug || user.slug;
    user.profile.avatarURL = req.body.avatarURL || user.profile.avatarURL;
    user.profile.coverURL = req.body.coverURL || user.profile.coverURL;
    const updatedUser = await user.save();
    res.send({
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
  const userslug = await User.findOne({ slug: req.params.id });
  const user = userslug ?? (await User.findById(req.params.id));
  const checkIsFriend =
    user.id == req.user._id ? 'user' : await isFriend(req.user._id, user.id);

  if (user) {
    res.send({
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

const findUser = async (id) => {
  const userslug = await User.findOne({ slug: id });
  const user = userslug ?? (await User.findById(id));
  return user ?? null;
};

export { signIn, signUp, editProfile, getUserByID, findUser };
