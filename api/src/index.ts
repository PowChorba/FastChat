import express from "express"
const cors = require('cors')
const {dbConnection} = require("./dataBase/db")
import route from './routes/index'
import { Socket, SocketUser } from "./types"
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

const addUser = (userId: string, socketId: string) => {
    !users.some((user: SocketUser)=> user?.userId === userId) && users.push({userId, socketId})
}

const removeUser = (socketId: string) => {
    users = users.filter((user: SocketUser) => user.socketId !== socketId)
}

const getUser = (userId: string) => {
    return users.find((user: SocketUser) => user.userId === userId)
}

io.on('connection', (socket: any) => {
    console.log('User connected')
    socket.on('addUser', (userId: string) =>{
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })

    socket.on('disconnect', () =>{
        console.log('a user disconnected')
        removeUser(socket.id)
        io.emit('getUsers', users)
    })

    socket.on('sendMessage', ({senderId, receiverId, text,senderChat}: Socket) => {
        const user = getUser(receiverId)
        io.to(user?.socketId).emit('getMessage', {
            senderId, text , senderChat
        })
        console.log("text",text)
    })
})