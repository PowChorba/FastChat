import {Router} from 'express'
import { allChats, newChat, userChat } from './chats'
import { allMessages, messageChat, newMessage } from './messages'
import { allUsers, updateUsers, newUser, userById } from './user'

const router = Router()

//USERS
router.get('/users', allUsers)
router.post('/users', newUser)
// router.put('/users/:userId', contactsUser)
router.put('/users', updateUsers)
router.get('/users/:userId', userById)

//CHAT
router.post('/chats', newChat)
router.get('/chats', allChats)
router.get('/chats/:userId', userChat)

//MESSAGES
router.post('/messages', newMessage)
router.get('/messages/:chatId', messageChat)
router.get('/messages', allMessages)

export default router