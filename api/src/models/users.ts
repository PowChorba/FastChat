import { Schema, model } from "mongoose";

const UserSchema = new Schema({
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
    module.exports = model('User', UserSchema)