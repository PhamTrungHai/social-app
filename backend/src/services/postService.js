import { Models } from '../models/prismaDB.js';

const getOnePost = async (postID) => {
  const post = await Models.Post.findUnique({
    where: {
      id: parseInt(postID),
    },
    include: {
      _count: {
        select: { Likes: true, Comments: true },
      },
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
  return post;
};

const getPostStats = async (postId) => {
  const post = await Models.Post.findUnique({
    where: {
      id: parseInt(postId),
    },
    select: {
      _count: {
        select: { Likes: true, Comments: true },
      },
    },
  });
  return post;
};

const getAllPosts = async (userId) => {
  const posts = await Models.Post.findMany({
    select: {
      id: true,
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
      Likes: {
        select: {
          id: true,
        },
        where: {
          Users: {
            id: userId,
          },
        },
      },
    },
  });
  return posts;
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

const updatePost = async (postId, content, imageURL) => {
  try {
    const post = await Models.Post.update({
      where: {
        id: postId,
      },
      data: {
        content: content,
        attachment: imageURL,
      },
    });
    return post;
  } catch (error) {
    throw new Error(error);
  }
};

const deletePost = async (postId) => {
  try {
    const post = await Models.Post.delete({
      where: {
        id: postId,
      },
    });
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

const getPostLikes = async (postId) => {
  try {
    const likes = await Models.Like.findMany({
      where: {
        post_id: parseInt(postId),
      },
      include: {
        Users: true,
      },
    });
    return likes;
  } catch (error) {
    throw new Error(error);
  }
};

const likePost = async (userId, postID) => {
  try {
    const like = await Models.Like.create({
      data: {
        Users: {
          connect: {
            id: userId,
          },
        },
        Posts: {
          connect: {
            id: parseInt(postID),
          },
        },
      },
    });
    return like;
  } catch (error) {
    throw new Error(error);
  }
};

const unlikePost = async (likeId) => {
  try {
    const unLike = await Models.Like.delete({
      where: {
        id: parseInt(likeId),
      },
    });
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

const getPostComments = async (postId) => {
  try {
    const comments = await Models.Comment.findMany({
      where: {
        post_id: parseInt(postId),
      },
      include: {
        Users: true,
      },
    });
    return comments;
  } catch (error) {
    throw new Error(error);
  }
};

const createComment = async (userId, postId, content, imageURL) => {
  try {
    const comment = await Models.Comment.create({
      data: {
        Users: {
          connect: {
            id: userId,
          },
        },
        Posts: {
          connect: {
            id: parseInt(postId),
          },
        },
        content: content,
        attachment: imageURL,
      },
    });
    return comment;
  } catch (error) {
    throw new Error(error);
  }
};

const updateComment = async (commentId, content) => {
  try {
    const comment = await Models.Comment.update({
      where: {
        id: parseInt(commentId),
      },
      data: {
        content: content,
      },
    });
    return comment;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteComment = async (commentId) => {
  try {
    const comment = await Models.Comment.delete({
      where: {
        id: parseInt(commentId),
      },
    });
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  getOnePost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getPostLikes,
  getPostStats,
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
};
