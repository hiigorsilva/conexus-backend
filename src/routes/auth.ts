import * as authController from '../controllers/auth'
import { mainRouter } from './main'

mainRouter.post('/auth/signup', authController.signup)
// mainRouter.post('/auth/signin')
