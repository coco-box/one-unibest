import type { Request, Response } from 'express'
import { UserModel } from '../models/user.js'
import { WechatService } from '../services/wechat.js'
import { JwtUtils } from '../utils/jwt.js'
import { ApiResponse } from '../utils/response.js'

export class AuthController {
  /**
   * 微信小程序登录
   */
  static async wxLogin(req: Request, res: Response) {
    try {
      const { code } = req.body

      if (!code) {
        return ApiResponse.error(res, '缺少登录凭证', 400)
      }

      // 1. 调用微信接口换取 openid 和 session_key
      const wxResult = await WechatService.code2Session(code)

      if (wxResult.errcode || !wxResult.openid) {
        return ApiResponse.error(res, wxResult.errmsg || '微信登录失败', 400)
      }

      // 2. 查找或创建用户
      let user = await UserModel.findByOpenid(wxResult.openid)

      if (!user) {
        // 首次登录，创建用户
        user = await UserModel.create({
          openid: wxResult.openid,
          unionid: wxResult.unionid,
          sessionKey: wxResult.session_key!,
        })
      }
      else {
        // 更新 session_key
        user = await UserModel.update(wxResult.openid, {
          sessionKey: wxResult.session_key!,
        })
      }

      // 3. 生成 JWT Token
      const token = JwtUtils.sign({
        userId: user!.id,
        openid: user!.openid,
      })

      // 4. 返回登录结果
      return ApiResponse.success(res, {
        token,
        expiresIn: JwtUtils.getExpiresIn(),
        user: {
          id: user!.id,
          openid: user!.openid,
          nickname: user!.nickname,
          avatar: user!.avatar,
        },
      }, '登录成功')
    }
    catch (error) {
      console.error('微信登录错误:', error)
      return ApiResponse.error(res, '登录失败，请稍后重试', 500)
    }
  }
}
