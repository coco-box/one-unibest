import process from 'node:process'

export const wechatConfig = {
  appId: process.env.WECHAT_APP_ID,
  appSecret: process.env.WECHAT_APP_SECRET,
  code2SessionUrl: 'https://api.weixin.qq.com/sns/jscode2session',
}
