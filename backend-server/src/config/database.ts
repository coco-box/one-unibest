import type { Database } from 'sqlite'
import path from 'node:path'
import process from 'node:process'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

interface User {
  id: number
  openid: string
  nickname?: string
  avatar?: string
  created_at: string
  updated_at: string
}

class SQLiteDatabase {
  private db: Database | null = null
  private dbPath: string

  constructor() {
    this.dbPath = path.join(process.cwd(), 'data', 'app.db')
  }

  async connect() {
    try {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database,
      })
      // 创建用户表
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          openid TEXT UNIQUE NOT NULL,
          nickname TEXT,
          avatar TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      console.log('✅ SQLite database connected successfully')
    }
    catch (error) {
      console.error('❌ Error connecting to SQLite database:', error)
      throw error
    }
  }

  async findUserByOpenid(openid: string): Promise<User | null> {
    if (!this.db)
      await this.connect()
    const result = await this.db!.get('SELECT * FROM users WHERE openid = ?', [openid])
    return result || null
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    if (!this.db)
      await this.connect()

    const result = await this.db!.run(
      'INSERT INTO users (openid, nickname, avatar) VALUES (?, ?, ?)',
      [userData.openid, userData.nickname, userData.avatar],
    )
    const newUser = await this.db!.get('SELECT * FROM users WHERE id = ?', [result.lastID])
    return newUser as User
  }

  async updateUser(id: number, userData: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User | null> {
    if (!this.db)
      await this.connect()
    const setClause = Object.keys(userData).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(userData), new Date().toISOString(), id]

    await this.db!.run(
      `UPDATE users SET ${setClause}, updated_at = ? WHERE id = ?`,
      values,
    )
    const result = await this.db!.get('SELECT * FROM users WHERE id = ?', [id])
    return result || null
  }

  async close() {
    if (this.db) {
      await this.db.close()
      console.log('🔒 Database connection closed')
    }
  }
}

const db = new SQLiteDatabase()

// 优雅关闭数据库连接
process.on('SIGINT', async () => {
  await db.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await db.close()
  process.exit(0)
})

export { db }
