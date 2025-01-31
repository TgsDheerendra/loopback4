import {Response} from '@loopback/rest';
import {RESPONSE_STATUS} from './constants';

export class ApiResponse {
  static success(res: Response, message: string, data: any = null) {
    return res.status(200).json({
      status: RESPONSE_STATUS.SUCCESS,
      message,
      data,
    });
  }

  static created(res: Response, message: string, data: any = null) {
    return res.status(201).json({
      status: RESPONSE_STATUS.SUCCESS,
      message,
      data,
    });
  }

  static error(res: Response, statusCode: number, message: string) {
    return res.status(statusCode).json({
      status: RESPONSE_STATUS.ERROR,
      message,
    });
  }
}
