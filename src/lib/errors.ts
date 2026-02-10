export class AppError extends Error {
    constructor(
      message: string,
      public readonly statusCode: number,
      public readonly expose = false,
    ) {
      super(message);
      this.name = "AppError";
    }
  }
  
  export const unauthorized = () => new AppError("Unauthorized", 401);
  export const forbidden = () => new AppError("Forbidden", 403);
  export const badRequest = (message = "Bad request") =>
    new AppError(message, 400, true);
  export const tooManyRequests = () =>
    new AppError("Too many requests", 429, true);
  
  export function toPublicError(error: unknown): { statusCode: number; message: string } {
    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        message: error.expose ? error.message : "Request failed",
      };
    }
  
    return { statusCode: 500, message: "Internal server error" };
  }