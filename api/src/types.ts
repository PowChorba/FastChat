export interface User {
    _id?: string
    nickName: string
    userEmail: string
    password: string
    image: string
    contacts?: User[]
}

export interface ChatsType {
    chatsUsers: User[]
}

export interface Message{
    textMessage: string
    messageAuthor: User
    messageTime: string
}