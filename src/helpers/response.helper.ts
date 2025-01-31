// src/helpers/response.helper.ts
import {HttpErrors} from '@loopback/rest';

export class ResponseHelper {
  static success(message: string, data: any = null) {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(statusCode: number, message: string) {
    switch (statusCode) {
      case 400:
        throw new HttpErrors.BadRequest(message);
      case 401:
        throw new HttpErrors.Unauthorized(message);
      case 403:
        throw new HttpErrors.Forbidden(message);
      case 404:
        throw new HttpErrors.NotFound(message);
      case 500:
      default:
        throw new HttpErrors.InternalServerError(message);
    }
  }
}
