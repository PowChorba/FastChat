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
exports.userById = exports.contactsUser = exports.allUsers = exports.newUser = void 0;
const users_1 = require("../models/users");
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickName, userEmail, password, image } = req.body;
    try {
        const newUser = yield users_1.Users.create({
            nickName,
            userEmail,
            password,
            image
        });
        res.status(201).json({ msg: 'Created', newUser });
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
            const findUser = yield users_1.Users.findOne({ nickName: nickName });
            if (findUser) {
                return res.send([findUser]);
            }
            else {
                return res.send('We could not find that user');
            }
        }
        else {
            const allUsers = yield users_1.Users.find();
            return res.json(allUsers);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.allUsers = allUsers;
const contactsUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { contact } = req.body;
    try {
        const findUser = yield users_1.Users.findById(userId);
        const findUserDos = yield users_1.Users.findById(contact);
        if (findUser && findUserDos) {
            yield findUser.updateOne({ $push: { contacts: contact } });
        }
        else {
            res.send('We could not find that user');
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.contactsUser = contactsUser;
const userById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const findUser = yield users_1.Users.findById(userId);
        if (findUser) {
            return res.send(findUser);
        }
        else {
            return res.json({ msg: 'We could not find that user' });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.userById = userById;
