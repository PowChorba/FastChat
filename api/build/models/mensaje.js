"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    messageTime: {
        type: Date
    }
});
module.exports = (0, mongoose_1.model)('Message', MessageSchema);
