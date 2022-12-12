import {Router} from 'express'
import { allChats, deleteChat, newChat, updateGroup, userChat } from './chats'
// import { allGroups, deleteGroup, newGroup, updateGroup } from './groups'
import { allMessages, deleteMessages, deleteNotifications, messageChat, newMessage } from './messages'
import { allUsers, updateUsers, newUser, userById, lastConnection } from './user'

const router = Router()

//USERS
router.get('/users', allUsers)
router.get('/users/:userId', userById)
router.post('/users', newUser)
router.put('/users', updateUsers)
router.put('/users/disconnect', lastConnection)

//CHAT
router.post('/chats', newChat)
router.get('/chats', allChats)
router.get('/chats/:userId', userChat)
router.delete('/chats/:chatId', deleteChat)
router.put("/chats",updateGroup)    

//MESSAGES
router.post('/messages', newMessage)
router.get('/messages/:chatId', messageChat)
router.get('/messages', allMessages)
router.put('/messages', deleteMessages)
router.put("/messages/notification",deleteNotifications)

export default router