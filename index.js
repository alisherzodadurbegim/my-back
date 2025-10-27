console.log('🟢 server/index.js started')

import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'

// routes import
import adminRoutes from './routes/adminRoute.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import uploadRoute from './routes/upload.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = express()

// Middlewares
server.use(express.json())
server.use(cors())
server.use(cookieParser())

// Static folders (lokal va deploy uchun yo'llarni tekshiring)
server.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
server.use('/public', express.static(path.join(__dirname, 'public')))

// API routes
server.use('/api/auth', authRoutes)
server.use('/api/products', productRoutes)
server.use('/api/cart', cartRoutes)
server.use('/api/orders', orderRoutes)
server.use('/api/upload', uploadRoute)
server.use('/api/admin', adminRoutes)

// Default route (health check)
server.get('/', (req, res) => {
	res.send('✅ Backend is running!')
})

// Async start: avval DB ga ulanish, keyin serverni ishga tushirish
async function start() {
	try {
		// Agar connectDB async bo'lsa await bilan chaqiring
		await connectDB() // agar connectDB sync bo'lsa ham oqibatiga ta'sir qilmaydi
		const PORT = process.env.PORT || 3000
		server.listen(PORT, () => {
			console.log(
				`MongoDB başarıyla bağlandı, tebrikler! http://localhost:${PORT}`
			)
		})
	} catch (err) {
		console.error('Server start failed:', err)
		process.exit(1)
	}
}

start()
