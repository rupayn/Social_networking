import express from "express";
const errorHandler = function () {};

type RequestHandlerType = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

const asyncHandler = function (requestHandler: RequestHandlerType) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err)=>{
      return next(err)
    });
  };
};
export { errorHandler, asyncHandler };
