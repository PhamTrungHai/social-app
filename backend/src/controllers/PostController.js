import * as uploadService from '../services/uploadService.js';
import * as PostService from '../services/postService.js';

async function getPosts(req, res) {
  const posts = await PostService.getAllPosts();
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
  res.send('Post created successfully!');
}
export { createPost, getPosts };
