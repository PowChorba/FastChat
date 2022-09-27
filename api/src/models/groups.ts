import { Schema, model, SchemaType } from "mongoose";

const GroupsSchema = new Schema({
    groupName: {
        type: String,
        require: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    admin: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    chats: {
        type: Schema.Types.ObjectId,
        ref: "Chats"
    }
})
module.exports = model('Groups', GroupsSchema)