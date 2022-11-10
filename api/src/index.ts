import express from "express"
const cors = require('cors')
const {dbConnection} = require("./dataBase/db")
import route from './routes/index'
import { Socket, SocketRoom, SocketUser } from "./types"
require('dotenv').config()


const app = express()
dbConnection()


app.set("port", process.env.PORT || 2500)

app.use(cors())

// Static files 
// app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.json());

app.use('/', route)

const server = app.listen(app.get("port"),()=>{
    console.log("Server is on port" + " " + process.env.PORT)
})

const io = require('socket.io')(3002, {
    cors: {
        origin: 'http://localhost:3000'
    }
})


let users: SocketUser[] = []
let groups: SocketRoom[] = []

const addUser = (userId: string, socketId: string) => {
    !users.some((user: SocketUser)=> user?.userId === userId) && users.push({userId, socketId})
}
const addGroup = (room: string, userId: string) => {
    !groups.some((groups: SocketRoom)=> groups?.room === room) && groups.push({room, userId})
}

const removeUser = (socketId: string) => {
    users = users.filter((user: SocketUser) => user.socketId !== socketId)
}

const getUser = (userId: string) => {
    return users.find((user: SocketUser) => user.userId === userId)
}

const getGroup = (groupId: string)=>{
    return groups.find((group: SocketRoom)=> group.userId === groupId)
}

io.on('connection', (socket: any) => {
    console.log(`User connected ${socket.id}`, )
    socket.on('addUser', (userId: string) =>{
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })

    socket.on('disconnect', () =>{
        console.log('a user disconnected')
        removeUser(socket.id)
        io.emit('getUsers', users)
    })

    socket.on('sendMessage', ({senderId, receiverId, text,senderChat, messageId, isGroup}: Socket) => {
        console.log("group",isGroup)
        if (!isGroup){
            const user = getUser(receiverId)
            io.to(user?.socketId).emit('getMessage', {
                senderId, text , senderChat, messageId
            })
        }else {
            io.to(isGroup).emit("getMessage",{
                senderId, text , senderChat, messageId
            })
        }
        })

    socket.on("sendEscribiendo",({senderId, receiverId, text, senderChat}:Socket)=>{
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getUserWritting",{
            senderId,text, senderChat
        })
    })
    socket.on("deleteMessage",({senderId, receiverId, text, senderChat, messageId, createdAt}:Socket)=>{
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getDeleteMessage",{
            senderId,text, senderChat, messageId, receiverId, createdAt
        })
    })
    socket.on("join_room",({room, userId}:SocketRoom)=>{
        socket.join(room)
        addGroup(room,userId)
    })
})