export type User = {
    _id?: string
    nickName: string
    userEmail: string
    password: string
    image: string
    contacts?: User[]
}

export type Chats = {
    _id?: string
    chatsUsers: string[]
}

export type NewChat = {
    _id?: string
    firstUser: string | User
    secondUser: string | User
}

export type Messages = {
    _id?: string
    textMessage: string
    messageAuthor: string
    chatId: string
    createdAt?: string | undefined
}
