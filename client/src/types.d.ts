//TYPES PARA LOS USUARIOS

export type User = {
    _id: string
    nickName: string
    userEmail: string
    password: string
    image: string
    contacts?: User[]
    bloqUsers: User[]
    lastConnection: string
}

export type CreateUser = {
    nickName: string
    userEmail: string
    password: string
    image: string
}

export type ErrorsUser = {
    nickName: boolean
    password: boolean
}

//TYPES PARA LOS CHATS

export type Chats = {
    _id: string
    chatsUsers: User[]
    creator: User
    img?: string
    groupName?: string
    admin?: User[]
}
// TYPES PARA LOS MENSAJES

export type Messages = {
    _id: string
    textMessage: string
    messageAuthor: string
    chatId: string
    createdAt: string
    isDeleted?: boolean
    isImage?: boolean
    isAudio?: boolean
    notification?: boolean
}

export type CreateMessages = {
    textMessage: string
    messageAuthor: string
    chatId: string
    isImage?: boolean
    isAudio?: boolean
    _id?: string
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
    senderChat: string,
    messageId: string
    isImage: boolean
    type?: string
    isAudio: boolean
}

//GROUPS CHATS
export interface GroupsChats {
    _id: string
    img: string
    groupName: string
    members: User[]
    admin: User[]
}

export interface GetMessageDeleted extends GetMessageData {
    messageId: string,
    createdAt: string
}


export interface CreateGroup {
    _id: string
    groupName: string
    creator: string
    admin: string
    img: string
    chatsUsersId: string
}

export interface RemoveUser {
    groupId: string
    leaveGroup: string
}

export interface UpdateGroup {
    groupId: string
    members?: string
    admin?: string
    removeAdmin?: string
    groupName?: string
    img?: string
    leaveGroup?: string
}

export type CombinedChats = Chats & GroupsChats

export interface Response {
    ok: boolean
    msg: string
}
export interface userDisconnected {
    userId: string,
    data: {
        ok: boolean,
        msg: string
    }
}
export interface NewChat {
    firstUser: string
    secondUser: string
    _id: string
} 
export interface PayloadChats {
    _id: string;
    chatsUsers: User[];
    creator: User;
    groupName?: string;
}
export interface NewChatsReducer {
    _id: string;
    chatsUsers: User[];
    creator: User;
}
export interface NewChatSocket {
    payloadChats: PayloadChats
    newChats: NewChatsReducer
}
export interface AddUser {
    groupId: string
    members: string
}
