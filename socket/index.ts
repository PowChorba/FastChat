import { Socket, SocketRoom, SocketUser } from "../api/src/types"
import express from "express"


const io = require('socket.io')(process.env.SOCKET_PORT, {
    cors: {
        origin: ['http://127.0.0.1:5641','http://localhost:3000']
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

const removeUser = (socketId: string) => {
    users = users.filter((user: SocketUser) => user.socketId !== socketId)
}

const getUser = (userId: string) => {
    return users.find((user: SocketUser) => user.userId === userId)
}

const getGroup = (groupId: string) => {
    return groups.find((group: SocketRoom) => group.userId === groupId)
}

io.on('connection', (socket: any) => {
    console.log(`User connected ${socket.id}`,)
    socket.on('addUser', (userId: string) => {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })

    socket.on('disconnect', () => {
        console.log('a user disconnected')
        removeUser(socket.id)
        io.emit('getUsers', users)
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