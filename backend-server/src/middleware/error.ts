import type { NextFunction, Request, Response } from 'express'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err)

  // 如果响应已经发送，则交给默认的 Express 错误处理器
  if (res.headersSent) {
    return next(err)
  }

  // 返回错误响应
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    timestamp: new Date().toISOString(),
  })
}
