export interface User {
    _id?: string
    nickName: string
    userEmail: string
    password: string
    image: string
    contacts?: User[]
    groups?: any[]
    bloqUsers: User[]
}

export interface ChatsType {
    chatsUsers: User[]
}

export interface Message{
    textMessage: string
    messageAuthor: User
    messageTime: string
}

export interface Socket {
    senderId: string
    receiverId: string
    text: string
    senderChat: string
}

export interface SocketUser {
    userId: string
    socketId: string
}

export interface ChatsModel {
    _id?: string
    chatsUsers?: User[]
    groupName?: string
    admin?: User[]
    img?: string
}