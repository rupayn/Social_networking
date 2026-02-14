import multer from "multer";

export const multerUploadSingle = multer({
  limits: {
    fileSize: 1024 * 1024 * 5, //5MB
  },
});

export const singleAvatar = multerUploadSingle.single("avatar");
export const singleUploadDpAndCv= multerUploadSingle.fields([
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
