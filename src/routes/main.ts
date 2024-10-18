import { Router } from 'express'
import * as authController from '../controllers/auth'
import * as feedController from '../controllers/feed'
import * as pingController from '../controllers/ping'
import * as tweetController from '../controllers/tweet'
import * as userController from '../controllers/user'
import { verifyJWT } from '../utils/jwt'

export const mainRouter = Router()

// TEST
mainRouter.get('/ping', pingController.ping)
mainRouter.get('/private-ping', verifyJWT, pingController.privatePing)

// AUTH
mainRouter.post('/auth/signup', authController.signup)
mainRouter.post('/auth/signin', authController.signin)

// TWEET
mainRouter.post('/tweet', verifyJWT, tweetController.addTweet)
mainRouter.get('/tweet/:id', verifyJWT, tweetController.getTweet)
mainRouter.get('/tweet/:id/answers', verifyJWT, tweetController.getAnswers)
mainRouter.post('/tweet/:id/like', verifyJWT, tweetController.likeTweetToggle)

// USER
mainRouter.get('/:username', verifyJWT, userController.getUser)
mainRouter.get('/:username/tweets', verifyJWT, userController.getUserTweets)
mainRouter.post('/:username/follow', verifyJWT, userController.followUserToggle)
mainRouter.put('/user', verifyJWT, userController.updateUser)
// mainRouter.put('/user/avatar')
// mainRouter.put('/user/cover')

// CONTENT
// TODO: corrigir erro de usuário não encontrado
mainRouter.get('/feed', verifyJWT, feedController.getFeed)
// mainRouter.get('/search')
// mainRouter.get('/trending')
// mainRouter.get('/suggestions')
