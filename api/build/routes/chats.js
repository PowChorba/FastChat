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
exports.updateGroup = exports.deleteChat = exports.userChat = exports.allChats = exports.newChat = void 0;
const chats_1 = require("../models/chats");
const newChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstUser, secondUser, groupName, chatsUsersId, admin, creator, img } = req.body;
    try {
        const alreadyChatOne = yield chats_1.Chats.findOne({
            chatsUsers: [firstUser, secondUser]
        });
        const alreadyChatTwo = yield chats_1.Chats.findOne({
            chatsUsers: [secondUser, firstUser]
        });
        if (!firstUser && !secondUser) {
            const groupsCreated = yield chats_1.Chats.create({
                groupName,
                creator,
                chatsUsers: [chatsUsersId],
                admin,
                img
            });
            let chat = {
                chatsUsers: groupsCreated.chatsUsers,
                groupName,
                creator,
                admin,
                img
            };
            res.json({ ok: true, msg: "succesfully created", chat: groupsCreated });
        }
        else if (alreadyChatOne || alreadyChatTwo) {
            return res.json({ ok: true, msg: 'Chat already created' });
        }
        else {
            const newChat = yield chats_1.Chats.create({
                chatsUsers: [firstUser, secondUser]
            });
            return res.json({ ok: true, msg: "succesfully created", chat: newChat });
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
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const findChat = yield chats_1.Chats.findById(chatId);
        if (findChat) {
            findChat.deleteOne({ _id: chatId });
            return res.json({ ok: true, chatId, msg: 'Chat deleted successfully' });
        }
    }
    catch (error) {
        res.json({ ok: false, msg: "error" });
    }
});
exports.deleteChat = deleteChat;
const updateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, members, admin, groupName, leaveGroup, removeAdmin, img } = req.body;
    try {
        const groupSearch = yield chats_1.Chats.findById(groupId);
        if (groupSearch) {
            if (members) {
                yield groupSearch.updateOne({ $push: { chatsUsers: members } });
                return res.json({ ok: true, msg: "succesfully updated" });
            }
            else if (admin) {
                yield groupSearch.updateOne({ $push: { admin: admin } });
                return res.json({ ok: true, msg: "succesfully updated" });
            }
            else if (groupName) {
                yield groupSearch.updateOne({ groupName });
                return res.json({ ok: true, msg: "succesfully updated" });
            }
            else if (leaveGroup) {
                yield groupSearch.updateOne({ $pull: { chatsUsers: leaveGroup } });
                return res.json({ ok: true, msg: "succesfully removed" });
            }
            else if (removeAdmin) {
                yield groupSearch.updateOne({ $pull: { admin: removeAdmin } });
                return res.json({ ok: true, msg: "succesfully removed" });
            }
            else if (img) {
                yield groupSearch.updateOne({ img });
            }
        }
        else
            return res.json({ ok: false, msg: "error" });
    }
    catch (e) {
        res.status(404).json({ ok: false, msg: e });
    }
});
exports.updateGroup = updateGroup;
