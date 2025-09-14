import process from 'node:process'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JwtPayload {
  userId: number
  openid: string
}

export class JwtUtils {
  static sign(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] })
  }

  static verify(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  }

  /**
   * 获取 token 过期时间（秒）
   */
  static getExpiresIn(): number {
    const expiresIn = JWT_EXPIRES_IN
    // 解析时间字符串，如 '7d' -> 7 * 24 * 60 * 60 秒
    if (typeof expiresIn === 'string') {
      const match = expiresIn.match(/^(\d+)([smhd])$/)
      if (match) {
        const value = Number.parseInt(match[1])
        const unit = match[2]
        switch (unit) {
          case 's': return value
          case 'm': return value * 60
          case 'h': return value * 60 * 60
          case 'd': return value * 24 * 60 * 60
          default: return 7 * 24 * 60 * 60 // 默认 7 天
        }
      }
    }
    return typeof expiresIn === 'number' ? expiresIn : 7 * 24 * 60 * 60
  }
}
