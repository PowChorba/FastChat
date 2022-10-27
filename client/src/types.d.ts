//TYPES PARA LOS USUARIOS

export type User = {
    _id: string
    nickName: string
    userEmail: string
    password: string
    image: string
    contacts?: User[]
    bloqUsers: string[]
}

export type CreateUser = {
    nickName: string
    userEmail: string
    password: string
    image: string
}

//TYPES PARA LOS CHATS

export type Chats = {
    _id: string
    chatsUsers: User[]
}

export type NewChat = {
    _id?: string
    firstUser: string | User
    secondUser: string | User
}

// TYPES PARA LOS MENSAJES

export type Messages = {
    _id: string
    textMessage: string
    messageAuthor: string
    chatId: string
    createdAt: string
}

export type CreateMessages = {
    textMessage: string
    messageAuthor: string
    chatId: string
}

//DELETE USER
export type DeleteUser = {
    userId: string
    contactId: string
}

//SOCKET io DATA
export interface SocketUser {
    userId: string
    socketId: string
}
export interface GetMessageData {
    senderId: string,
    text: string,
    senderChat: string
}
// createdAt: number
export interface MessageLocalState extends GetMessageData{
}