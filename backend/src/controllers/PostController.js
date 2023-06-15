import * as uploadService from '../services/uploadService.js';
import * as PostService from '../services/postService.js';

async function getPosts(req, res) {
  const posts = await PostService.getAllPosts(req.user._id);
  if (!posts) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  res.json(posts);
}

async function createPost(req, res) {
  let result;
  if (req.file) {
    result = await uploadService.streamUpload(req);
  }
  const post = await PostService.createPost(
    req.user._id,
    req.body.content,
    result ? result.secure_url : ''
  );
  if (!post) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  res.status(201).send('Post created successfully!');
}

async function getPost(req, res) {
  const post = await PostService.getOnePost({ id: req.params.id });
  if (!post) {
    return res.status(404).json({ message: 'Post not found!' });
  }
  res.json(post);
}

async function updatePost(req, res) {
  const post = await PostService.getOnePost({ id: req.params.id });
  if (!post) {
    return res.status(404).json({ message: 'Post not found!' });
  }
  if (post.user_id !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized!' });
  }
  const updatedPost = await PostService.updatePost(
    { id: req.params.id },
    req.body.content
  );
  if (!updatedPost) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  res.send('Post updated successfully!');
}

async function deletePost(req, res) {
  const post = await PostService.getOnePost({ id: req.params.id });
  if (!post) {
    return res.status(404).json({ message: 'Post not found!' });
  }
  if (post.Users.id !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized!' });
  }
  const deletedPost = await PostService.deletePost({ id: req.params.id });
  if (!deletedPost) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  res.send('Post deleted successfully!');
}

async function getPostLikes(req, res) {
  const getPost = PostService.getOnePost(req.params.id);
  const getLikes = PostService.getPostLikes(req.params.id);
  const [post, likes] = await Promise.all([getPost, getLikes]);
  if (!post) {
    return res.status(404).json({ message: 'Post not found!' });
  }
  if (!likes) {
    return res.status(404).json({ message: 'Likes not found!' });
  }
  res.json(likes);
}

async function likePost(req, res) {
  const likes = await PostService.likePost(req.user._id, req.params.id);
  if (!likes) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  const post = await PostService.getPostStats(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found!' });
  }
  res.status(201).send({ like: likes, postStat: post._count });
}

async function unlikePost(req, res) {
  const unlikePost = await PostService.unlikePost(req.params.likeId);
  if (!unlikePost) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  const post = await PostService.getPostStats(req.params.id);
  res.status(201).send({ postStat: post._count });
}

async function commentPost(req, res) {
  let result;
  if (req.file) {
    result = await uploadService.streamUpload(req);
  }
  const comment = await PostService.createComment(
    req.user._id,
    req.params.id,
    req.body.content,
    result ? result.secure_url : ''
  );
  if (!comment) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  res.status(201).send('Comment created successfully!');
}

async function updateComment(req, res) {
  const comment = await PostService.getOneComment(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found!' });
  }
  if (comment.user_id !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized!' });
  }
  const updatedComment = await PostService.updateComment(
    req.params.commentId,
    req.body.content
  );
  if (!updatedComment) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  res.send('Comment updated successfully!');
}

async function deleteComment(req, res) {
  const comment = await PostService.getOneComment(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found!' });
  }
  if (comment.user_id !== req.user._id) {
    return res.status(403).json({ message: 'Not authorized!' });
  }
  const deletedComment = await PostService.deleteComment(req.params.commentId);
  if (!deletedComment) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  res.send('Comment deleted successfully!');
}

async function getPostComments(req, res) {
  const getPost = PostService.getOnePost(req.params.id);
  const getComments = PostService.getPostComments(req.params.id);
  const [post, comments] = await Promise.all([getPost, getComments]);
  if (!post) {
    return res.status(404).json({ message: 'Post not found!' });
  }
  if (!comments) {
    return res.status(404).json({ message: 'Comments not found!' });
  }
  res.json(comments);
}

export {
  createPost,
  getPosts,
  likePost,
  getPostLikes,
  unlikePost,
  getPost,
  updatePost,
  deletePost,
  commentPost,
  updateComment,
  deleteComment,
  getPostComments,
};
