"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allMessages = exports.messageChat = exports.newMessage = void 0;
const mensaje_1 = require("../models/mensaje");
const newMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { textMessage, messageAuthor, chatId } = req.body;
    try {
        const newMessage = yield mensaje_1.Messages.create({
            textMessage,
            messageAuthor,
            chatId,
        });
        res.status(201).send(newMessage);
    }
    catch (error) {
        console.log(error);
    }
});
exports.newMessage = newMessage;
const messageChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const messages = yield mensaje_1.Messages.find({
            chatId,
        });
        res.send(messages);
    }
    catch (error) {
        console.log(error);
    }
});
exports.messageChat = messageChat;
const allMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allMessages = yield mensaje_1.Messages.find();
        res.send(allMessages);
    }
    catch (error) {
        console.log(error);
    }
});
exports.allMessages = allMessages;
