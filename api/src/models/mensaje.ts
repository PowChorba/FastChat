import { Schema, model, SchemaType } from "mongoose";

const MessageSchema = new Schema({
textMessage: {
    type: String,
    required: true,
},
messageAuthor: {
    type: Schema.Types.ObjectId,
    ref: "User"
},
chatId: {
    type: String
},
isDeleted: {
    type: Boolean,
    default: false
}
}, {
    timestamps: true
})

export const Messages = model('Messages', MessageSchema)