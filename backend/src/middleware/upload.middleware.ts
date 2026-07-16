import multer from "multer";
import uuid from "uuid";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuid.v4();
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only JPEG and PNG image files are allowed!"));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb limit
});

export const uploads = {
  single: (fieldName: string) => upload.single(fieldName),
  array: (fieldName: string, maxCount: number) =>
    upload.array(fieldName, maxCount),
  field: (fieldsArray: { name: string; maxCount?: number }[]) =>
    upload.fields(fieldsArray),
};
