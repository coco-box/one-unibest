import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'

const router = Router()

// 微信小程序登录
router.post('/wxLogin', AuthController.wxLogin)

export default router
