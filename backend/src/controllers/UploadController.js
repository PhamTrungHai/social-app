import * as uploadService from '../services/uploadService.js';

async function uploadSingleFile(req, res) {
  const result = await uploadService.streamUpload(req);
  res.send(result);
}
export { uploadSingleFile };
