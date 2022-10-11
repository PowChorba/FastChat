"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chats = void 0;
const mongoose_1 = require("mongoose");
const ChatsSchema = new mongoose_1.Schema({
    chatsUsers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }]
});
ChatsSchema.plugin(require("mongoose-autopopulate"));
exports.Chats = (0, mongoose_1.model)('Chats', ChatsSchema);
