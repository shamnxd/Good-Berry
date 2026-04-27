const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const HTTP_STATUS = require('../../constants/statusCodes');
const MESSAGES = require('../../constants/messages');


const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream(
      {
        folder: 'products',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });

    readStream.pipe(writeStream);
  });
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.NO_FILE_UPLOADED });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.FILE_UPLOADED_SUCCESSFULLY,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.ERROR_UPLOADING_FILE,
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
};