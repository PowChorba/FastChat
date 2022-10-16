"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const { dbConnection } = require("./dataBase/db");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const index_1 = __importDefault(require("./routes/index"));
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
    console.log("server is on port" + " " + process.env.PORT);
});
const serverSocket = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE"],
    },
});
io.on("connection", (socket) => {
    console.log(`new connection: ${socket.id}`);
});
