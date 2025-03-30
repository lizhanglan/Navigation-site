export class BusinessError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number) {
      super(message);
      this.name = "BusinessError";
      this.statusCode = statusCode || 400;
    }
  }
  

  export enum ErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
  }
