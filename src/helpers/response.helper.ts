// src/helpers/response.helper.ts
import {HttpErrors} from '@loopback/rest';

export class ResponseHelper {
  static success(message: string, data: any = null, success: boolean = true) {
    return {
      success,
      message,
      data,
    };
  }

  static error(statusCode: number, message: string) {
    switch (statusCode) {
      case 400:
        return HttpErrors.BadRequest(message);
      case 401:
        return HttpErrors.Unauthorized(message);
      case 403:
        return HttpErrors.Forbidden(message);
      case 404:
        return HttpErrors.NotFound(message);
      case 500:
      default:
        return HttpErrors.InternalServerError(message);
    }
  }
}
