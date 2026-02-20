import multer from "multer";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "./public/temp");
  },
  filename: function (_req, file, cb) {
    const unique = crypto.randomUUID();

    cb(null, `${unique}-${file.originalname}`);
  },
});
// const storage=multer.memoryStorage()
export const multerUploadSingle = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5MB
  },
});

export interface MulterFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export const singleAvatar = multerUploadSingle.single("avatar");
export const singleUploadDpAndCv = multerUploadSingle.fields([
  { name: "avatar", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);
export const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 50, //50MB
  },
});
export const noUpload = multer().none();

export const attachmentsMulter = multerUpload.array("files", 5);
