export interface User {
    _id?: string
    nickName: string
    userEmail: string
    password: string
    image: string
    contacts?: User[]
    groups?: any[]
    bloqUsers: User[]
    lastConnection?: string
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
    isGroup: boolean
    messageId?: string
    createdAt?: string
    isImage: boolean
    isAudio?: boolean
}
export interface SocketRoom {
    room: string,
    userId: string
}

export interface SocketUser {
    userId: string
    socketId: string
}
export interface SocketGroup {
    room: string,
    users: string[]
}

export interface ChatsModel {
    _id?: string
    chatsUsers?: User[]
    groupName?: string
    creator: User
    admin?: User[]
    img?: string
}