"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    nickName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // default:
    },
    contacts: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
    // chats : [{
    //     type: Schema.Types.ObjectId,
    //     ref: "User"
    // }]
});
UserSchema.plugin(require("mongoose-autopopulate"));
module.exports = (0, mongoose_1.model)('User', UserSchema);
