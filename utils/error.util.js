class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // which line or file or code getting error we can find with this ->
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
