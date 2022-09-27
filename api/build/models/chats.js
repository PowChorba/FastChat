"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatsSchema = new mongoose_1.Schema({
    chatsUsers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    chatsMessage: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Message"
        }]
});
ChatsSchema.plugin(require("mongoose-autopopulate"));
module.exports = (0, mongoose_1.model)('Chats', ChatsSchema);
