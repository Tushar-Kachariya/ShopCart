import multer from 'multer';
import crypto from 'crypto';
import path from 'path';



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/image/uploads'); 
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, name) {
      if (err) return cb(err);

      const fn = name.toString('hex') + path.extname(file.originalname);
      console.log('file name', fn); 
      cb(null, fn)
    });
  }
});

const upload = multer({ storage });

export default upload;
