"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chats_1 = require("./chats");
// import { allGroups, deleteGroup, newGroup, updateGroup } from './groups'
const messages_1 = require("./messages");
const user_1 = require("./user");
const router = (0, express_1.Router)();
//USERS
router.get('/users', user_1.allUsers);
router.get('/users/:userId', user_1.userById);
router.post('/users', user_1.newUser);
router.put('/users', user_1.updateUsers);
router.put('/users/disconnect', user_1.lastConnection);
//CHAT
router.post('/chats', chats_1.newChat);
router.get('/chats', chats_1.allChats);
router.get('/chats/:userId', chats_1.userChat);
router.delete('/chats/:chatId', chats_1.deleteChat);
router.put("/chats", chats_1.updateGroup);
//MESSAGES
router.post('/messages', messages_1.newMessage);
router.get('/messages/:chatId', messages_1.messageChat);
router.get('/messages', messages_1.allMessages);
router.put('/messages', messages_1.deleteMessages);
router.put("/messages/notification", messages_1.deleteNotifications);
exports.default = router;
