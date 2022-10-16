"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chats_1 = require("./chats");
const messages_1 = require("./messages");
const user_1 = require("./user");
const router = (0, express_1.Router)();
//USERS
router.get('/users', user_1.allUsers);
router.post('/users', user_1.newUser);
router.put('/users/:userId', user_1.contactsUser);
router.get('/users/:userId', user_1.userById);
//CHAT
router.post('/chats', chats_1.newChat);
router.get('/chats', chats_1.allChats);
router.get('/chats/:userId', chats_1.userChat);
//MESSAGES
router.post('/messages', messages_1.newMessage);
router.get('/messages/:chatId', messages_1.messageChat);
router.get('/messages', messages_1.allMessages);
exports.default = router;
