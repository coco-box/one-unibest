import type { NextFunction, Request, Response } from 'express'
import { JwtUtils } from '../utils/jwt.js'
import { ApiResponse } from '../utils/response.js'

export interface AuthRequest extends Request {
  user?: {
    openid: string
    userId: string
  }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, '未提供认证令牌', 401)
    }

    const token = authHeader.substring(7)
    const payload = JwtUtils.verify(token)

    req.user = payload
    next()
  }
  catch (error) {
    return ApiResponse.error(res, '认证令牌无效', 401)
  }
}
