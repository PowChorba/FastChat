import express from "express"
const cors = require('cors')
const { dbConnection } = require("./dataBase/db")
import route from './routes/index'
import { Socket, SocketRoom, SocketUser } from "./types"
import { Server as SocketServer } from 'socket.io'
import axios from "axios"
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

const server = app.listen(app.get("port"), () => {
    console.log("Server is on port" + " " + process.env.PORT)
})

const io: any = new SocketServer(server, {
    cors: {
        origin: ['http://127.0.0.1:5641', 'http://localhost:3000']
    }
})


let users: SocketUser[] = []
let groups: SocketRoom[] = []

const addUser = (userId: string, socketId: string) => {
    !users.some((user: SocketUser) => user?.userId === userId) && users.push({ userId, socketId })
}
const addGroup = (room: string, userId: string) => {
    !groups.some((groups: SocketRoom) => groups?.room === room) && groups.push({ room, userId })
}

const removeUser = (userId: string) => {
    users = users.filter((user: SocketUser) => user.userId !== userId)
}

const getUser = (userId: string) => {
    return users.find((user: SocketUser) => user.userId === userId)
}
const getUserBySocket = (socketId: string) => {
    return users.find((user: SocketUser) => user.socketId === socketId)
}

const getGroup = (groupId: string) => {
    return groups.find((group: SocketRoom) => group.userId === groupId)
}

io.on('connect', (socket: any) => {
    console.log(`User connected ${socket.id}`,)
    socket.on('addUser', (userId: string) => {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })

    socket.on('disconnect', async() => {
        let user = getUserBySocket(socket.id)
        removeUser(user?.userId||"")
        console.log('a user disconnected', user?.userId)
        io.emit('getUsers', users)
        try {
            const res = await axios.put("http://localhost:3001/users/disconnect", user)
            console.log(res.data)
            io.emit("userDisconnected", {userId:user?.userId, data:(res.data.ok? res.data : "")})
        }catch (e){
            console.log(e)
        }

    })

    socket.on('sendMessage', ({ senderId, receiverId, text, senderChat, messageId, isGroup, isImage, isAudio }: Socket) => {
        if (!isGroup) {
            const user = getUser(receiverId)
            io.to(user?.socketId).emit('getMessage', {
                senderId, text, senderChat, messageId, isImage, isAudio
            })
        } else {
            io.to(senderChat).emit("getMessage", {
                senderId, text, senderChat, messageId, isImage, isAudio
            })
        }
    })

    socket.on("sendEscribiendo", ({ senderId, receiverId, text, senderChat }: Socket) => {
        let type = "text"
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getUserWritting", {
            senderId, text, senderChat, type
        })
    })
    socket.on("sendAudioRecording", ({ senderId, receiverId, text, senderChat }: Socket) => {
        let type = "audio"
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getUserWritting", {
            senderId, text, senderChat, type
        })
    })
    socket.on("deleteMessage", ({ senderId, receiverId, text, senderChat, messageId, createdAt }: Socket) => {
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getDeleteMessage", {
            senderId, text, senderChat, messageId, receiverId, createdAt
        })
    })
    socket.on("join_room", ({ room, userId }: SocketRoom) => {
        socket.join(room)
        addGroup(room, userId)
    })
})