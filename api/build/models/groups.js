"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Groups = void 0;
const mongoose_1 = require("mongoose");
const GroupsSchema = new mongoose_1.Schema({
    groupName: {
        type: String,
    },
    members: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
    admin: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
    img: {
        type: String,
        require: true
    }
});
exports.Groups = (0, mongoose_1.model)('Groups', GroupsSchema);
