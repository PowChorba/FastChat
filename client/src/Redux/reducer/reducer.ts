import { createReducer } from '@reduxjs/toolkit'
import Users from '../../Components/Home/Users/Users';
import { Chats, Messages, NewChat, User } from "../../types";
import { USER_CHATS, ALL_USERS, NEW_CHAT, NEW_USER, USER_BY_ID, ALL_MESSAGES, NEW_MESSAGE, ALL_CHATS, USER_FILTER, DELETE_MESSAGE, DELETE_CHAT, DELETE_CONTACT, USER_CONTACTS, BLOCK_USER, UNBLOCK_USER } from '../actions/actions'

interface Reducer {
    users: User[],
    newUser: User[]
    chats: Chats[]
    newChat: Chats[]
    messages: Messages[]
    userChats: Chats[]
    searchUser: User[]
}

const initialState: Reducer = {
    users: [],
    newUser: [],
    chats: [],
    messages: [],
    newChat: [],
    userChats: [],
    searchUser: [],
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
        state.newChat = state.newChat?.concat(action.payload)
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
    callback.addCase(USER_FILTER.fulfilled, (state, action) => {
        state.searchUser = action.payload
    })
    callback.addCase(BLOCK_USER.fulfilled, (state, action) => {
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
                state.users = stateUserCopy
            }
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
})
