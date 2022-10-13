import { Schema, model } from "mongoose";

const ChatsSchema = new Schema({
chatsUsers: [{
    type: Schema.Types.ObjectId,
    ref: "Users",
    autopopulate: true
}]

})
ChatsSchema.plugin(require("mongoose-autopopulate"))
export const Chats = model('Chats', ChatsSchema)