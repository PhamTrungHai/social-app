import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    try {
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } catch (error) {
      reject(error);
    }
  });
};

export { streamUpload };
