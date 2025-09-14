import type { Response } from 'express'

export interface ApiResponseData<T = any> {
  code: number
  message: string
  data?: T
  timestamp: string
}

export class ApiResponse {
  static success<T>(res: Response, data?: T, message = '操作成功'): Response {
    return res.json({
      code: 200,
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  }

  static error(res: Response, message = '操作失败', code = 500): Response {
    return res.status(code).json({
      code,
      message,
      timestamp: new Date().toISOString(),
    })
  }
}
