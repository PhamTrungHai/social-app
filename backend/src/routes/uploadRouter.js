import express from 'express';
import multer from 'multer';
import { isAuth } from '../middlewares/authentication.js';
import * as UploadController from '../controllers/UploadController.js';

const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post(
  '/',
  isAuth,
  upload.single('avatar'),
  UploadController.uploadSingleFile
);
export default uploadRouter;
