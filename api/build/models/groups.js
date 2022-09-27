"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GroupsSchema = new mongoose_1.Schema({
    groupName: {
        type: String,
        require: true
    },
    members: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
    admin: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
    chats: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chats"
    }
});
module.exports = (0, mongoose_1.model)('Groups', GroupsSchema);
