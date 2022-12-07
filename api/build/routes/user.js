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
exports.lastConnection = exports.userById = exports.updateUsers = exports.allUsers = exports.newUser = void 0;
const users_1 = require("../models/users");
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickName, userEmail, password, image } = req.body;
    try {
        const newUser = yield users_1.Users.create({
            nickName,
            userEmail,
            password,
            image,
        });
        res.status(201).json({ msg: "Created", newUser });
    }
    catch (error) {
        console.log(error);
    }
});
exports.newUser = newUser;
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickName } = req.query;
    try {
        if (nickName) {
            const findUser = yield users_1.Users.findOne({ nickName: nickName }).populate([
                "contacts",
                "bloqUsers",
            ]);
            if (findUser) {
                return res.send([findUser]);
            }
            else {
                return res.send("We could not find that user");
            }
        }
        else {
            const allUsers = yield users_1.Users.find().populate(["contacts", "bloqUsers"]);
            return res.json(allUsers);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.allUsers = allUsers;
const updateUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { userId, contactId, contact, nickName, password, image, bloqUserId } = req.body;
    try {
        const findUser = yield users_1.Users.findById(userId).populate("contacts");
        const findUserDos = yield users_1.Users.findById(contact);
        const blockedUser = yield users_1.Users.findById(bloqUserId).populate("contacts");
        const alreadyAdded = (_a = findUser === null || findUser === void 0 ? void 0 : findUser.contacts) === null || _a === void 0 ? void 0 : _a.filter((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) === contact; });
        const alreadyBloq = (_b = findUser === null || findUser === void 0 ? void 0 : findUser.bloqUsers) === null || _b === void 0 ? void 0 : _b.filter((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) === contact; });
        if (findUser && findUserDos) {
            if ((alreadyAdded === null || alreadyAdded === void 0 ? void 0 : alreadyAdded.length) !== 0) {
                return res.json({ ok: true, msg: "Contact already exist" });
            }
            else if ((alreadyBloq === null || alreadyBloq === void 0 ? void 0 : alreadyBloq.length) !== 0) {
                return res.send({ ok: true, msg: "Contact already blocked" });
            }
            else {
                yield findUser.updateOne({ $push: { contacts: contact } });
                return res.json({ ok: true, userId, findUserDos, msg: "contact created" });
            }
        }
        else if (!contact && findUser && !contactId && !bloqUserId) {
            yield findUser.updateOne({ image, password, nickName });
            let userUpdate = {
                image,
                password,
                nickName,
                userId
            };
            return res.json({ ok: true, userUpdate, msg: "User updated" });
        }
        else if (findUser && contactId) {
            const filterContact = (_c = findUser.contacts) === null || _c === void 0 ? void 0 : _c.filter((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) === contactId; });
            if ((filterContact === null || filterContact === void 0 ? void 0 : filterContact.length) === 1) {
                yield findUser.updateOne({ $pull: { contacts: contactId } });
                return res.json({ ok: true, contactId, userId, msg: "Contact deleted successfully" });
            }
            else {
                return res.json({ ok: false, msg: "Esta rompiendo" });
            }
        }
        else if (findUser && bloqUserId) {
            const filterBlocks = (_d = findUser.bloqUsers) === null || _d === void 0 ? void 0 : _d.filter((e) => { var _a; return ((_a = e._id) === null || _a === void 0 ? void 0 : _a.toString()) === bloqUserId; });
            if ((filterBlocks === null || filterBlocks === void 0 ? void 0 : filterBlocks.length) === 0) {
                yield findUser.updateOne({ $push: { bloqUsers: bloqUserId } });
                return res.json({ ok: true, userId, blockUserId: bloqUserId, msg: "Contact blocked successfully" });
            }
            else if ((filterBlocks === null || filterBlocks === void 0 ? void 0 : filterBlocks.length) === 1) {
                yield findUser.updateOne({ $pull: { bloqUsers: bloqUserId } });
                // await findUser.updateOne({ $push:{contacts: blockedUser}})
                return res.json({ ok: true, userId, findUser, blockedUser, blockUserId: bloqUserId, msg: "Contact unblocked successfully" });
            }
            else {
                return res.send("Contact blocked successfully ");
            }
        }
        else {
            return res.send("We could not find that user");
        }
    }
    catch (error) {
        return res.status(404).json({ ok: false, msg: error });
    }
});
exports.updateUsers = updateUsers;
const userById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const findUser = yield users_1.Users.findById(userId);
        if (findUser) {
            return res.send(findUser);
        }
        else {
            return res.json({ msg: "We could not find that user" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.userById = userById;
const lastConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const lastConnection = new Date().toISOString();
        const findUser = yield users_1.Users.findById(userId);
        if (findUser) {
            const updateUser = yield (findUser === null || findUser === void 0 ? void 0 : findUser.updateOne({ lastConnection: lastConnection }));
            return res.json({ ok: true, msg: lastConnection });
        }
        else
            return res.json({ ok: true, msg: "couldnt find your user fujk" });
    }
    catch (e) {
        res.status(401).json({ ok: false, msg: e });
    }
});
exports.lastConnection = lastConnection;
