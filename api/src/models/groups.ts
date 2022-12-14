import { Schema, model, SchemaType } from "mongoose";

const GroupsSchema = new Schema({
    groupName: {
        type: String,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    admin: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    img: {
        type: String,
        require: true
    }
})
export const Groups = model('Groups', GroupsSchema)