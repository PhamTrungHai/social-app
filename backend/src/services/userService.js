import User from '../models/User.js';
import { Models } from '../models/prismaDB.js';

const getOneUser = async (queryObj) => {
  var user;
  if (Object.hasOwn(queryObj, 'id')) {
    user = await User.findById(queryObj.id);
  } else {
    user = await User.findOne(queryObj);
  }
  return user;
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
        users: {
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
  const user = await getOneUser({ id: id });
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

export { getOneUser, createUserSlug, createUser, updatedUserInfo };
