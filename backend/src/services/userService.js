import User from '../models/User.js';
import { Models } from '../models/prismaDB.js';
import bcrypt from 'bcryptjs';

const getUserByID = async (id) => {
  return await User.findById(id);
};

const getUserID = async (slug) => {
  const user = await User.findOne({ slug: slug });
  return user.id;
};

const getUserByQuery = async (queryObj) => {
  return await User.findOne(queryObj);
};

const createUserSlug = (email) => {
  const string = new String(email);
  const slug = string.replace(
    '.com',
    string.charCodeAt(string.lastIndexOf('.'))
  );
  return slug;
};

const createUser = async (name, email, password, slug) => {
  const newUser = new User({
    name: name,
    email: email,
    password: bcrypt.hashSync(password),
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
        Users: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  };
  await addUser();
  return user;
};

const updatedUserInfo = async (id, name, email, slug, avatarURL, coverURL) => {
  const user = await getUserByID(id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.slug = slug || user.slug;
    user.profile.avatarURL = avatarURL || user.profile.avatarURL;
    user.profile.coverURL = coverURL || user.profile.coverURL;
    const updatedUser = await user.save();
    return updatedUser;
  } else return null;
};

export {
  getUserByID,
  getUserByQuery,
  createUserSlug,
  createUser,
  updatedUserInfo,
  getUserID,
};
