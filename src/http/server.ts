import cors from 'cors'
import express, { urlencoded } from 'express'
import helmet from 'helmet'
import { mainRouter } from '../routes/main'

const server = express()
server.use(helmet())
server.use(cors())
server.use(urlencoded({ extended: true }))
server.use(express.json())

// ROUTES
server.use(mainRouter)

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running in ${process.env.BASE_URL}`)
})
