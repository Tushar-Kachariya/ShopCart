import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists (use a stable, project-root-relative path)
const UPLOAD_DIR = path.resolve("./uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // store uploads in the project-level `uploads` folder
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, (err, name) => {
      if (err) return cb(err);
      const fileName = name.toString("hex") + path.extname(file.originalname);
      cb(null, fileName);
    });
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
