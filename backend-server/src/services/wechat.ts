import axios from 'axios'
import { wechatConfig } from '../config/wechat.js'

export interface Code2SessionResponse {
  openid?: string
  session_key?: string
  unionid?: string
  errcode?: number
  errmsg?: string
}

export class WechatService {
  /**
   * 通过 code 换取 openid 和 session_key
   */
  static async code2Session(code: string): Promise<Code2SessionResponse> {
    try {
      const response = await axios.get(wechatConfig.code2SessionUrl, {
        params: {
          appid: wechatConfig.appId,
          secret: wechatConfig.appSecret,
          js_code: code,
          grant_type: 'authorization_code',
        },
      })

      return response.data
    }
    catch (error) {
      console.error('微信 code2Session 请求失败:', error)
      throw new Error('微信登录服务异常')
    }
  }

  /**
   * 验证 session_key 是否有效
   */
  static async checkSession(sessionKey: string): Promise<boolean> {
    // 这里可以实现 session_key 的验证逻辑
    // 微信没有直接的验证接口，通常通过解密用户数据来验证
    return true
  }
}
