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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const { dbConnection } = require("./dataBase/db");
const index_1 = __importDefault(require("./routes/index"));
const axios_1 = __importDefault(require("axios"));
const socket_io_1 = require("socket.io");
require('dotenv').config();
const app = (0, express_1.default)();
dbConnection();
app.set("port", process.env.PORT || 2500);
app.use(cors());
// Static files 
// app.use(express.static(path.join(__dirname, "public")))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use(express_1.default.json());
app.use('/', index_1.default);
const server = app.listen(app.get("port"), () => {
    console.log("Server is on port" + " " + process.env.PORT);
});
const io = new socket_io_1.Server(server, {
    // cors: {
    //     origin: ['http://127.0.0.1:5641', 'http://localhost:3000']
    // }
});
let users = [];
let groups = [];
const addUser = (userId, socketId) => {
    !users.some((user) => (user === null || user === void 0 ? void 0 : user.userId) === userId) && users.push({ userId, socketId });
};
const addGroup = (room, userId) => {
    !groups.some((groups) => (groups === null || groups === void 0 ? void 0 : groups.room) === room) && groups.push({ room, userId });
};
const removeUser = (userId) => {
    users = users.filter((user) => user.userId !== userId);
};
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};
const getUserBySocket = (socketId) => {
    return users.find((user) => user.socketId === socketId);
};
const getGroup = (groupId) => {
    return groups.find((group) => group.userId === groupId);
};
io.on('connect', (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
        io.emit('getUsers', users);
    });
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        let user = getUserBySocket(socket.id);
        removeUser((user === null || user === void 0 ? void 0 : user.userId) || "");
        io.emit('getUsers', users);
        try {
            const res = yield axios_1.default.put("http://localhost:3001/users/disconnect", user);
            io.emit("userDisconnected", { userId: user === null || user === void 0 ? void 0 : user.userId, data: (res.data.ok ? res.data : "") });
        }
        catch (e) {
            console.log(e);
        }
    }));
    socket.on('sendMessage', ({ senderId, receiverId, text, senderChat, messageId, isGroup, isImage, isAudio }) => {
        if (!isGroup) {
            const user = getUser(receiverId);
            io.to(user === null || user === void 0 ? void 0 : user.socketId).emit('getMessage', {
                senderId, text, senderChat, messageId, isImage, isAudio
            });
        }
        else {
            io.to(senderChat).emit("getMessage", {
                senderId, text, senderChat, messageId, isImage, isAudio
            });
        }
    });
    socket.on("sendEscribiendo", ({ senderId, receiverId, text, senderChat }) => {
        let type = "text";
        const user = getUser(receiverId);
        io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getUserWritting", {
            senderId, text, senderChat, type
        });
    });
    socket.on("sendAudioRecording", ({ senderId, receiverId, text, senderChat }) => {
        let type = "audio";
        const user = getUser(receiverId);
        io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getUserWritting", {
            senderId, text, senderChat, type
        });
    });
    socket.on("deleteMessage", ({ senderId, receiverId, text, senderChat, messageId, createdAt }) => {
        const user = getUser(receiverId);
        io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getDeleteMessage", {
            senderId, text, senderChat, messageId, receiverId, createdAt
        });
    });
    socket.on("join_room", ({ room, userId }) => {
        socket.join(room);
        addGroup(room, userId);
    });
});
