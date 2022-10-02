import { Schema, model } from "mongoose";
import { User } from "../types";

const UserSchema = new Schema<User>({
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
    type: Schema.Types.ObjectId,
    ref: "User"
}],
// chats : [{
//     type: Schema.Types.ObjectId,
//     ref: "User"
// }]
})
UserSchema.plugin(require("mongoose-autopopulate"))
export const Users = model('User', UserSchema)