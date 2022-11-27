import { Schema, model, SchemaType } from "mongoose";

const MessageSchema = new Schema({
_id :{
    type: String,
    required: true
},
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
})

export const Messages = model('Messages', MessageSchema)