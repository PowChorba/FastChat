"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotifications = exports.deleteAllMessagesChat = exports.deleteMessages = exports.allMessages = exports.messageChat = exports.newMessage = void 0;
const mensaje_1 = require("../models/mensaje");
const newMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { textMessage, messageAuthor, chatId, _id, isImage, isAudio } = req.body;
    try {
        const newMessage = yield mensaje_1.Messages.create({
            textMessage,
            messageAuthor,
            chatId,
            _id,
            isImage,
            isAudio
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
const deleteMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.body;
    try {
        const filterMessages = yield mensaje_1.Messages.findById(messageId);
        if (filterMessages) {
            yield filterMessages.updateOne({ textMessage: 'Message deleted', isDeleted: true });
            return res.json({ ok: true, msgDeleted: filterMessages });
        }
        return res.send('Rompiste todo');
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteMessages = deleteMessages;
const deleteAllMessagesChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const messagess = yield mensaje_1.Messages.find({ chatId });
        if (messagess) {
            // await messagess.map(e => e.delete)
        }
    }
    catch (error) {
    }
});
exports.deleteAllMessagesChat = deleteAllMessagesChat;
const deleteNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.body;
    try {
        yield mensaje_1.Messages.updateMany({ chatId }, { $set: { notification: false } });
        return res.json({ ok: true, msg: "notifications deleted", chatId });
    }
    catch (e) {
        console.log(e);
        return res.status(404).json({ ok: false, msg: e });
    }
});
exports.deleteNotifications = deleteNotifications;
