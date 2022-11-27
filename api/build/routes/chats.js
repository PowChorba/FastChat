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
exports.userChat = exports.allChats = exports.newChat = void 0;
const chats_1 = require("../models/chats");
const newChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstUser, secondUser } = req.body;
    try {
        const alreadyChatOne = yield chats_1.Chats.findOne({
            chatsUsers: [firstUser, secondUser]
        });
        const alreadyChatTwo = yield chats_1.Chats.findOne({
            chatsUsers: [secondUser, firstUser]
        });
        if (alreadyChatOne || alreadyChatTwo) {
            return res.send('You have already created a chat with that user');
        }
        else {
            const newChat = yield chats_1.Chats.create({
                chatsUsers: [firstUser, secondUser]
            });
            return res.json({ msg: 'Ok', newChat });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.newChat = newChat;
const allChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allChats = yield chats_1.Chats.find();
        res.send(allChats);
    }
    catch (error) {
        console.log(error);
    }
});
exports.allChats = allChats;
const userChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userChats = yield chats_1.Chats.find({
            chatsUsers: { $in: [userId] }
        });
        res.send(userChats);
    }
    catch (error) {
        console.log(error);
    }
});
exports.userChat = userChat;
