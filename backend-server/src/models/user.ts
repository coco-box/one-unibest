import { db } from '../config/database.js'

export interface User {
  id: number
  openid: string
  unionid?: string
  nickname?: string
  avatar?: string
  sessionKey?: string
  created_at: string
  updated_at: string
}

export class UserModel {
  static async findByOpenid(openid: string): Promise<User | null> {
    return await db.findUserByOpenid(openid)
  }

  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    return await db.createUser({
      openid: userData.openid,
      nickname: userData.nickname,
      avatar: userData.avatar,
    })
  }

  static async update(openid: string, updateData: Partial<User>): Promise<User | null> {
    // 先找到用户
    const existingUser = await this.findByOpenid(openid)
    if (!existingUser) {
      return null
    }
    // 更新用户
    return await db.updateUser(existingUser.id, {
      nickname: updateData.nickname,
      avatar: updateData.avatar,
    })
  }
}
