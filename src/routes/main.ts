import { Router } from 'express'
import * as authController from '../controllers/auth'
import * as pingController from '../controllers/ping'

export const mainRouter = Router()

// TEST
mainRouter.get('/ping', pingController.ping)
// mainRouter.get('/private-ping')

// AUTH
mainRouter.post('/auth/signup', authController.signup)
// mainRouter.post('/auth/signin')

// USER
// mainRouter.get('/:username')
// mainRouter.get('/:username/tweets')
// mainRouter.post('/:username/follow')
// mainRouter.put('/user')
// mainRouter.put('/user/avatar')
// mainRouter.put('/user/cover')

// TWEET
// mainRouter.post('/tweet') // posta um tweet
// mainRouter.get('/tweet/:id') // pega um tweet especifico
// mainRouter.get('/tweet/:id/answers') // pega as respostas de um tweet
// mainRouter.post('/tweet/:id/like') // dá like em um tweet

// CONTENT
// mainRouter.get('/feed')
// mainRouter.get('/search')
// mainRouter.get('/trending')
// mainRouter.get('/suggestions')
