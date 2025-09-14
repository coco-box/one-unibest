import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth.js'
import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// 获取用户信息（需要认证）
router.get('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    code: 200,
    message: '获取用户信息成功',
    data: req.user,
    timestamp: new Date().toISOString(),
  })
})

export default router
