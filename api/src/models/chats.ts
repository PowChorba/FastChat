import { Schema, model } from "mongoose";
import { ChatsModel } from "../types";

const ChatsSchema = new Schema<ChatsModel>({
chatsUsers: [{
    type: Schema.Types.ObjectId,
    ref: "Users",
    autopopulate: true
}],
groupName: {
    type: String,
    require: true
},
admin: [{
    type: Schema.Types.ObjectId,
    ref: "Users",
    autopopulate: true
}],
img: {
    type: String,
    require: true
} 

})
ChatsSchema.plugin(require("mongoose-autopopulate"))
export const Chats = model<ChatsModel>('Chats', ChatsSchema)