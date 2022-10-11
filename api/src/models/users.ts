import { Schema, model } from "mongoose";
import { User } from "../types";

const UserSchema = new Schema<User>({
nickName: {
    type: String,
    required: true,
    unique: true
},
userEmail: {
    type: String,
    required: true
},
password: {
    type: String,
    required: true
},
image: {
    type: String,
},
contacts: [{
    type: Schema.Types.ObjectId,
    ref: "Users",
    autopopulate: true
}]
})
UserSchema.plugin(require("mongoose-autopopulate"))
export const Users = model<User>('Users', UserSchema)