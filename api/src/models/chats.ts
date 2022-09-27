import { Schema, model } from "mongoose";

const ChatsSchema = new Schema({
chatsUsers: [{
    type: Schema.Types.ObjectId,
    ref: "User"
}
],
chatsMessage: [{
    type: Schema.Types.ObjectId,
    ref: "Message"
}]
})
ChatsSchema.plugin(require("mongoose-autopopulate"))
    module.exports = model('Chats', ChatsSchema)