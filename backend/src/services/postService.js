import { Models } from '../models/prismaDB.js';

const getOnePost = async (queryObj) => {
  const post = await Models.Post.findUnique({
    where: queryObj,
    include: {
      Users: true,
      Comments: {
        include: {
          Users: true,
        },
      },
      Likes: {
        include: {
          Users: true,
        },
      },
    },
  });
  return post ?? null;
};

const getAllPosts = async (queryObj) => {
  const posts = await Models.Post.findMany({
    select: {
      // id: true,
      content: true,
      attachment: true,
      date_posted: true,
      _count: {
        select: { Likes: true, Comments: true },
      },
      Users: {
        select: {
          id: true,
          name: true,
          profile: true,
        },
      },
    },
  });
  return posts ?? null;
};

const createPost = async (userId, content, imageURL) => {
  try {
    const post = await Models.Post.create({
      data: {
        Users: {
          connect: {
            id: userId,
          },
        },
        content: content,
        attachment: imageURL,
      },
    });
    return post;
  } catch (error) {
    throw new Error(error);
  }
};

export { getOnePost, getAllPosts, createPost };
