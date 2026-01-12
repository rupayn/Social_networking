export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown[];
  public readonly isOperational = true;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: unknown[] = []
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
