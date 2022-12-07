"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allGroups = exports.deleteGroup = exports.updateGroup = exports.newGroup = void 0;
const groups_1 = require("../models/groups");
const newGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupName, members, admin, img } = req.body;
    try {
        const groupsCreated = yield groups_1.Groups.create({
            groupName,
            members,
            admin,
            img
        });
        res.json({ ok: true, message: groupsCreated });
    }
    catch (e) {
        res.json({ ok: false, message: e });
    }
});
exports.newGroup = newGroup;
const updateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, members, admin, groupName, leaveGroup, removeAdmin } = req.body;
    try {
        const groupSearch = yield groups_1.Groups.findById(groupId);
        if (groupSearch) {
            if (members) {
                yield groupSearch.updateOne({ $push: { members: members } });
                return res.json({ ok: true, msg: "succesfully updated" });
            }
            if (admin) {
                yield groupSearch.updateOne({ $push: { admin: admin } });
                return res.json({ ok: true, msg: "succesfully updated" });
            }
            if (groupName) {
                yield groupSearch.updateOne({ groupName });
                return res.json({ ok: true, msg: "succesfully updated" });
            }
            if (leaveGroup) {
                yield groupSearch.updateOne({ $pull: { members: leaveGroup } });
            }
            if (removeAdmin) {
                yield groupSearch.updateOne({ $pull: { admin: removeAdmin } });
            }
        }
        else
            return res.json({ ok: false, msg: "error" });
    }
    catch (e) {
        res.status(404).json({ ok: false, msg: e });
    }
});
exports.updateGroup = updateGroup;
const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { groupId, userId } = req.body;
    try {
        const group = yield groups_1.Groups.findById(groupId);
        const admin = (_a = group === null || group === void 0 ? void 0 : group.admin) === null || _a === void 0 ? void 0 : _a.filter(e => { var _a, _b; return ((_b = (_a = e.type) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) === userId; });
        if (admin) {
            yield (group === null || group === void 0 ? void 0 : group.delete());
            res.json({ ok: true, msg: "deleted succesfully" });
        }
    }
    catch (e) {
        res.status(404).json({ ok: false, msg: e });
    }
});
exports.deleteGroup = deleteGroup;
const allGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allGroups = yield groups_1.Groups.find();
        return res.json({ ok: true, msg: allGroups });
        // return res.json(allGroups)
    }
    catch (e) {
        res.status(404).json({ ok: false, msg: "error" });
    }
});
exports.allGroups = allGroups;
