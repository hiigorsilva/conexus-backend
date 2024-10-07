import { Router } from 'express'
import * as pingController from '../controllers/ping'

export const mainRouter = Router()

mainRouter.get('/ping', pingController.ping)
