import express from 'express' //Modules
import cors from 'cors'
import 'dotenv/config'
import { router } from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'

const app = express()

connectDB()

app.use(express.json())

app.use(cors(corsConfig))

app.use('/', router)

export { app }
