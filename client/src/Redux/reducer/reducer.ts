import { createReducer } from '@reduxjs/toolkit'
import { Chats, Messages, Response, User } from "../../types";
import { USER_CHATS, ALL_USERS, NEW_CHAT, NEW_USER, USER_BY_ID, ALL_MESSAGES, NEW_MESSAGE, ALL_CHATS, USER_FILTER, DELETE_MESSAGE, DELETE_CHAT, DELETE_CONTACT, USER_CONTACTS, BLOCK_USER, UNBLOCK_USER, CREATE_GROUP_CHAT, DELETE_NOTIFICATIONS, CLEAR_RESPONSE, LAST_CONNECTION, UPDATE_GROUP, LEAVE_GROUP, ADD_USER, REMOVE_USER, SET_ADMIN, REMOVE_ADMIN, CHANGE_IMG, RECEIVE_SOCKET_MESSAGE, DELETE_SOCKET_MESSAGE } from '../actions/actions'


interface Reducer {
    users: User[],
    newUser: User[]
    chats: Chats[]
    newChat: Chats[]
    messages: Messages[]
    userChats: Chats[]
    searchUser: User[]
    response: Response
}

const initialState: Reducer = {
    users: [],
    newUser: [],
    chats: [],
    messages: [],
    newChat: [],
    userChats: [],
    searchUser: [],
    response: {ok:false, msg: ""}
}

export const clientReducer = createReducer(initialState, (callback) => {
    callback.addCase(ALL_USERS.fulfilled, (state, action) => {
        state.users = action.payload
    })
    callback.addCase(NEW_USER.fulfilled, (state, action) => {
        state.users = state.users?.concat(action.payload)
    })
    callback.addCase(USER_CHATS.fulfilled, (state, action) => {
        state.userChats = action.payload
    })
    callback.addCase(ALL_CHATS.fulfilled, (state, action) => {
        state.chats = action.payload
    })
    callback.addCase(NEW_CHAT.fulfilled, (state, action) => {
        let payloadChats;
        if (action.payload.ok) {
            if (action.payload.msg !== 'Chat already created'){
                payloadChats = {
                    _id: action.payload.chat._id,
                    chatsUsers: action.payload.chat.chatsUsers,
                    creator: action.payload.chat.chatsUsers[0]._id,
                    groupName: action.payload.chat.groupName || ""
                }
                
                let newChat = {
                    _id: action.payload.chat._id,
                    chatsUsers: action.payload.chat.chatsUsers,
                    creator: action.payload.chat.chatsUsers[0]._id,
                }
                state.chats = [...state.chats, newChat]
                state.userChats = [...state.userChats, payloadChats]
            }
            state.response = {ok:true, msg: action.payload.msg}
        }

    })
    callback.addCase(CREATE_GROUP_CHAT.fulfilled, (state, action) => {
        let payloadChats;
        if (action.payload.ok) {
            payloadChats = {
                _id: action.payload.chat._id,
                chatsUsers: action.payload.chat.chatsUsers,
                creator: action.payload.chat.creator,
                groupName: action.payload.chat.groupName,
                admin: action.payload.chat.admin,
                img: action.payload.chat.img
            }

            state.chats = [...state.chats, payloadChats]
            state.userChats = [...state.userChats, payloadChats]
            state.response = {ok:true, msg:action.payload.msg}
        }

    })
    callback.addCase(USER_BY_ID.fulfilled, (state, action) => {
        state.users = action.payload
    })
    callback.addCase(ALL_MESSAGES.fulfilled, (state, action) => {
        state.messages = action.payload
    })
    callback.addCase(NEW_MESSAGE.fulfilled, (state, action) => {
        state.messages = state.messages?.concat(action.payload)
    })
    callback.addCase(RECEIVE_SOCKET_MESSAGE.fulfilled, (state, action) => {
        if (!state.messages.some(msg=> msg._id === action.payload._id)){
            state.messages = state.messages?.concat(action.payload)
        }
    })
    callback.addCase(USER_FILTER.fulfilled, (state, action) => {
        state.searchUser = action.payload
    })
    callback.addCase(CLEAR_RESPONSE.fulfilled, (state, action) => {
        state.response = {ok:false, msg:""}
    })
    callback.addCase(BLOCK_USER.fulfilled, (state, action) => {
        console.log(action.payload)
        if (action.payload.ok) {
            if (action.payload.msg === "Contact blocked successfully") {
                let stateUserCopy = state.users
                let indexActualUser = state.users.findIndex((user) => {
                    return user._id === action.payload.userId
                })
                let skip;
                let deletedContact = state.users[indexActualUser].contacts?.filter((ele) => {
                    return ele._id !== action.payload.blockUserId
                })
                stateUserCopy[indexActualUser].contacts = deletedContact

                let searchContactBlocked = state.users.find((user) => {
                    return user._id === action.payload.blockUserId
                })
                searchContactBlocked ? stateUserCopy[indexActualUser].bloqUsers.push(searchContactBlocked) : skip = ""
                state.users = stateUserCopy
                let userChatsCopy = state.userChats
                let userDeleted = userChatsCopy.filter(user => user.chatsUsers[1]._id !== action.payload.blockUserId)
                state.response = {ok:true, msg:action.payload.msg}
                state.userChats = userDeleted
            }
        }
    })
    callback.addCase(UNBLOCK_USER.fulfilled, (state, action) => {
        if (action.payload.ok) {
            let stateUserCopy = state.users
            let indexActualUser = state.users.findIndex((user) => {
                return user._id === action.payload.userId
            })
            if (action.payload.msg === "Contact unblocked successfully") {
                let unblockUser = stateUserCopy[indexActualUser].bloqUsers.filter((blockUsers) => {
                    return blockUsers._id !== action.payload.blockUserId
                })
                stateUserCopy[indexActualUser].bloqUsers = unblockUser
                stateUserCopy[indexActualUser].contacts = unblockUser
                state.users = stateUserCopy
                state.response = {ok:true, msg: action.payload.msg}
            }
        }
    })
    callback.addCase(DELETE_CHAT.fulfilled, (state, action) => {
        if (action.payload.ok) {
            let stateChatsCopy = state.chats
            let userChatsCopy = state.userChats
            let chatDeleted = stateChatsCopy.filter((chat) => {
                return chat._id !== action.payload.chatId
            })
            // console.log(chatDeleted)
            let userChatDeleted = userChatsCopy.filter((chat) => {
                return chat._id !== action.payload.chatId
            })
            state.chats = chatDeleted
            state.userChats = userChatDeleted
        }
    })
    callback.addCase(DELETE_CONTACT.fulfilled, (state, action) => {
        if (action.payload.ok) {
            let stateUserCopy = state.users
            let indexActualUser = state.users.findIndex((user) => {
                return user._id === action.payload.userId
            })
            let deletedContact = state.users[indexActualUser].contacts?.filter((ele) => {
                return ele._id !== action.payload.contactId
            })
            stateUserCopy[indexActualUser].contacts = deletedContact
            state.users = stateUserCopy
            let userChatsCopy = state.userChats
            let userDeleted = userChatsCopy.filter(chat => chat._id !== action.payload.contactId)
            state.userChats = userDeleted
            state.response = {ok:true, msg: action.payload.msg}
        }
    })
    callback.addCase(USER_CONTACTS.fulfilled, (state, action) => {
        if (action.payload.ok) {
            if (action.payload.msg === "contact created") {
                let stateUserCopy = state.users
                let indexActualUser = state.users.findIndex((user) => {
                    return user._id === action.payload.userId
                })
                stateUserCopy[indexActualUser].contacts?.push(action.payload.findUserDos)
                state.users = stateUserCopy
                state.response = {ok:true, msg:action.payload.msg}
            } else if(action.payload.msg === "User updated"){
                console.log(action.payload.userUpdate)
                console.log(action.payload)
                let stateUserCopy = state.users
                 let indexActualUser = state.users.findIndex((user) => {
                    return user._id === action.payload.userUpdate.userId
                })
                stateUserCopy[indexActualUser].image = action.payload.userUpdate.image
                stateUserCopy[indexActualUser].nickName = action.payload.userUpdate.nickName
                stateUserCopy[indexActualUser].password = action.payload.userUpdate.password
                state.users = stateUserCopy
                state.response = {ok:true, msg:action.payload.msg}
            }
        }
    })
    callback.addCase(DELETE_MESSAGE.fulfilled, (state, action) => {
        let msgDeleted = {
            textMessage: "Message deleted",
            messageAuthor: action.payload.msgDeleted.messageAuthor,
            chatId: action.payload.msgDeleted.chatId,
            isDeleted: true,
            _id: action.payload.msgDeleted._id,
            createdAt: action.payload.msgDeleted.createdAt
        }
        state.messages = state.messages.filter(msg => msg._id !== action.payload.msgDeleted._id)
        state.messages.push(msgDeleted)

    })
    callback.addCase(DELETE_SOCKET_MESSAGE.fulfilled, (state, action) => {
        let msgDeleted = {
            textMessage: "Message deleted",
            messageAuthor: action.payload.messageAuthor,
            chatId: action.payload.chatId,
            isDeleted: true,
            _id: action.payload._id,
            createdAt: action.payload.createdAt
        }
        state.messages = state.messages.filter(msg => msg._id !== action.payload._id)
        state.messages.push(msgDeleted)

    })
    callback.addCase(LAST_CONNECTION.fulfilled, (state, action) => {
        if (action.payload.data.ok && action.payload.data.msg !== "couldnt find your user fujk"){
            let stateUserCopy = state.users
            let indexActualUser = state.users.findIndex((user) => {
                return user._id === action.payload.userId
            })
            stateUserCopy[indexActualUser].lastConnection = action.payload.data.msg
            state.users = stateUserCopy

            let stateChatsCopy = state.chats
             stateChatsCopy.forEach((chat)=>{
                chat.chatsUsers.forEach(user=> {
                return user._id === action.payload.userId ? user.lastConnection = action.payload.data.msg: ""}) 
            })
            state.chats = stateChatsCopy
        }
    })
    callback.addCase(DELETE_NOTIFICATIONS.fulfilled, (state, action) => {
        if (action.payload.ok) {
            let copyMessages = state.messages
            let messages:any = []
            copyMessages.forEach((msg) => {
                let message = msg
                if (msg.chatId === action.payload.chatId) {
                    message.notification = false
                }
                messages.push(message)
            })
            state.messages = messages
        }

    })
    callback.addCase(LEAVE_GROUP.fulfilled, (state, action) => {
        if (action.payload.ok) {
            console.log(action.payload)
            let stateChatsCopy = state.chats
            let userChatsCopy = state.userChats
            let chatDeleted = stateChatsCopy.filter((chat) => {
                return chat._id !== action.payload.groupId
            })
            let userChatDeleted = userChatsCopy.filter((chat) => {
                return chat._id !== action.payload.groupId
            })
            state.chats = chatDeleted
            state.userChats = userChatDeleted
        }

    })
    callback.addCase(UPDATE_GROUP.fulfilled, (state, action) => {
        if (action.payload.ok) {
            let stateChatsCopy = state.chats
            let userChatsCopy = state.userChats
            stateChatsCopy.forEach((chat)=>{
                if (chat._id === action.payload.groupId) return chat.groupName = action.payload.groupName
            })
            userChatsCopy.forEach((chat) => {
                if (chat._id === action.payload.groupId) return chat.groupName = action.payload.groupName
            })
            state.chats = stateChatsCopy
            state.userChats = userChatsCopy
        }

    })
    callback.addCase(ADD_USER.fulfilled, (state, action) => {
        if (action.payload.ok) {
            let stateChatsCopy = state.chats
            let userChatsCopy = state.userChats

            let user:any = state.users.find((user)=> user._id === action.payload.members)
            stateChatsCopy.forEach((chat)=>{
                if (chat._id === action.payload.groupId) return chat.chatsUsers.push(user)
            })
            userChatsCopy.forEach((chat) => {
                if (chat._id === action.payload.groupId) return chat.chatsUsers.push(user) 
            })
            state.chats = stateChatsCopy
            state.userChats = userChatsCopy
        }

    })
    callback.addCase(REMOVE_USER.fulfilled, (state, action) => {
        if (action.payload.ok) {
            console.log(action.payload)
            let stateChatsCopy = state.chats
            let userChatsCopy = state.userChats

            stateChatsCopy.forEach((chat,i)=>{
                if (chat._id === action.payload.groupId){
                     stateChatsCopy[i].chatsUsers = chat.chatsUsers.filter((user)=> user._id !== action.payload.leaveGroup)
                }
            })
            userChatsCopy.forEach((chat, i) => {
                if (chat._id === action.payload.groupId) {
                    userChatsCopy[i].chatsUsers = chat.chatsUsers.filter((user)=> user._id !== action.payload.leaveGroup)
                }
            })
            state.chats = stateChatsCopy
            state.userChats = userChatsCopy
        }

    })
    callback.addCase(SET_ADMIN.fulfilled, (state, action) => {
        if (action.payload.ok) {
            console.log(action.payload)
            let stateChatsCopy = state.chats
            let userChatsCopy = state.userChats

            let user:any = state.users.find((user)=> user._id === action.payload.admin)
            stateChatsCopy.forEach((chat)=>{
                if (chat._id === action.payload.groupId){
                     return chat.admin?.push(user)
                }
            })
            userChatsCopy.forEach((chat) => {
                if (chat._id === action.payload.groupId) {
                    return chat.admin?.push(user)
                }
            })
            state.chats = stateChatsCopy
            state.userChats = userChatsCopy
        }

    })
    callback.addCase(REMOVE_ADMIN.fulfilled, (state, action) => {
        if (action.payload.ok) {
            console.log(action.payload)
            let stateChatsCopy = state.chats
            let userChatsCopy = state.userChats

            stateChatsCopy.forEach((chat,i)=>{
                if (chat._id === action.payload.groupId){
                    stateChatsCopy[i].admin = chat.admin?.filter((user)=> user._id !== action.payload.removeAdmin)
                }
            })
            userChatsCopy.forEach((chat,i) => {
                if (chat._id === action.payload.groupId){   
                    stateChatsCopy[i].admin = chat.admin?.filter((user)=> user._id !== action.payload.removeAdmin)
                }
            })
            state.chats = stateChatsCopy
            state.userChats = userChatsCopy
        }

    })
    callback.addCase(CHANGE_IMG.fulfilled, (state, action) => {
        if (action.payload.ok) {
            console.log(action.payload)
            let stateChatsCopy = state.chats
            let userChatsCopy = state.userChats

            stateChatsCopy.forEach((chat,i)=>{
                if (chat._id === action.payload.groupId){
                    return chat.img = action.payload.img
                }
            })
            userChatsCopy.forEach((chat,i) => {
                if (chat._id === action.payload.groupId){   
                    return chat.img = action.payload.img
                }
            })
            state.chats = stateChatsCopy
            state.userChats = userChatsCopy
        }

    })
    
})