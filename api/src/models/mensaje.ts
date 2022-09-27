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
messageTime: {
type: Date
}

})
    module.exports = model('Message', MessageSchema)