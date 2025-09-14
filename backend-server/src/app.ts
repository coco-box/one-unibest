import process from 'node:process'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
// 导入中间件
import { errorHandler } from './middleware/error.js'
// 导入路由
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'

// 首先加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件配置
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 路由配置
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

// 健康检查
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// 错误处理中间件
app.use(errorHandler)

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV}`)
})

export default app
