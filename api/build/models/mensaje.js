"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true
    },
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
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isImage: {
        type: Boolean,
        default: false
    },
    isAudio: {
        type: Boolean,
        default: false
    },
    notification: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    _id: false
});
exports.Messages = (0, mongoose_1.model)('Messages', MessageSchema);
