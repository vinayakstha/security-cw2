import multer from "multer";
import uuid from "uuid";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { Request, Response, NextFunction } from "express";

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

const JPEG_MAGIC_BYTES = [0xff, 0xd8, 0xff];
const PNG_MAGIC_BYTES = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function isJPEG(buffer: Buffer): boolean {
  if (buffer.length < JPEG_MAGIC_BYTES.length) return false;
  return JPEG_MAGIC_BYTES.every((byte, i) => buffer[i] === byte);
}

function isPNG(buffer: Buffer): boolean {
  if (buffer.length < PNG_MAGIC_BYTES.length) return false;
  return PNG_MAGIC_BYTES.every((byte, i) => buffer[i] === byte);
}

/**
 * Middleware that validates the uploaded file's actual content (magic bytes)
 * to prevent MIME type spoofing. Must be used AFTER uploads.single() / uploads.array().
 */
export const validateFileMagicBytes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.file) {
    return next();
  }

  try {
    const fileBuffer = await fsPromises.readFile(req.file.path);

    if (!isJPEG(fileBuffer) && !isPNG(fileBuffer)) {
      // Delete the invalid file from disk
      await fsPromises.unlink(req.file.path);
      res.status(400).json({
        message:
          "Invalid file content. Only JPEG and PNG files are allowed based on file signature.",
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const uploads = {
  single: (fieldName: string) => upload.single(fieldName),
  array: (fieldName: string, maxCount: number) =>
    upload.array(fieldName, maxCount),
  field: (fieldsArray: { name: string; maxCount?: number }[]) =>
    upload.fields(fieldsArray),
};
