import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    slug: { type: String, unique: true },
    profile: {
      avatarURL: { type: String },
      coverURL: { URL: { type: String }, position: { type: Number } },
      friends: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
