import { AppError } from "../utils/AppError.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg
    ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    : "field value";
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);

  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // Production operational vs unknown errors
    if (error.isOperational) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error("ERROR 💥", err);
      res.status(500).json({
        success: false,
        message: "Something went very wrong!",
      });
    }
  }
};

export default errorMiddleware;
