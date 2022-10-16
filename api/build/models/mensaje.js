"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    textMessage: {
        type: String,
        required: true,
    },
    messageAuthor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    chatId: {
        type: String
    }
}, {
    timestamps: true
});
exports.Messages = (0, mongoose_1.model)('Messages', MessageSchema);
