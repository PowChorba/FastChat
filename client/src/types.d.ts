//TYPES PARA LOS USUARIOS

export type User = {
    _id: string
    nickName: string
    userEmail: string
    password: string
    image: string
    contacts?: User[]
    bloqUsers: User[]
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
    img?: string
    groupName?: string
    admin?: User[]
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
    isDeleted?: boolean
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

//GROUPS CHATS
export interface GroupsChats {
    _id: string
    img: string
    groupName: string
    members: User[]
    admin: User[]
}

export interface CreateGroup {
    groupName: string
    admin: string
    img: string
    chatsUsersId: string
}

export interface RemoveUser {
    groupId: string
    leaveGroup: string
}

export interface AddUser {
    groupId: string
    members: string
}

export interface MakeAdmin {
    groupId: string
    admin: string
}

export interface RemoveAdmin {
    groupId: string
    removeAdmin: string
}

export type CombinedChats = Chats & GroupsChats
