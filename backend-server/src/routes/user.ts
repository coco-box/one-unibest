import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth.js'
import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { UserModel } from '../models/user.js'
import { ApiResponse } from '../utils/response.js'

const router = Router()

// 获取用户信息（需要认证）
router.get('/info', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findByOpenid(req.user!.openid)
    if (!user) {
      return ApiResponse.error(res, '用户不存在', 404)
    }

    return ApiResponse.success(res, {
      userId: user.id,
      username: user.openid, // 使用 openid 作为 username
      nickname: user.nickname || '微信用户',
      avatar: user.avatar,
      openid: user.openid, // 保留 openid 字段供其他用途
      created_at: user.created_at,
      updated_at: user.updated_at,
    }, '获取用户信息成功')
  }
  catch (error) {
    console.error('获取用户信息失败:', error)
    return ApiResponse.error(res, '获取用户信息失败', 500)
  }
})

// 保留原有的 profile 接口以兼容
router.get('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    code: 200,
    message: '获取用户信息成功',
    data: req.user,
    timestamp: new Date().toISOString(),
  })
})

export default router
