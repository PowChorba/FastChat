import {Router} from 'express'
import { allChats, deleteChat, newChat, userChat } from './chats'
import { allGroups, deleteGroup, newGroup, updateGroup } from './groups'
import { allMessages, deleteMessages, messageChat, newMessage } from './messages'
import { allUsers, updateUsers, newUser, userById } from './user'

const router = Router()

//USERS
router.get('/users', allUsers)
router.get('/users/:userId', userById)
router.post('/users', newUser)
router.put('/users', updateUsers)

//CHAT
router.post('/chats', newChat)
router.get('/chats', allChats)
router.get('/chats/:userId', userChat)
router.delete('/chats/:chatId', deleteChat)

//MESSAGES
router.post('/messages', newMessage)
router.get('/messages/:chatId', messageChat)
router.get('/messages', allMessages)
router.put('/messages', deleteMessages)

// GROUPS
router.get("/groups",allGroups)
router.put("/groups",updateGroup)
router.post("/groups",newGroup)
router.delete("/groups",deleteGroup)

export default router