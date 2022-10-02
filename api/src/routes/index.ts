import {Router} from 'express'
import { allUsers, newUser } from './user'

const router = Router()

//USERS
router.get('/users', allUsers)
router.post('/users', newUser)

export default router