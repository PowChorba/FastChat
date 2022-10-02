export interface User {
    nickName: string
    userEmail: string
    password: string
    image: string
    contacts?: User[]
}

