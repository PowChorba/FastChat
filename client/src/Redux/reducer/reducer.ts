import { createReducer} from '@reduxjs/toolkit'
import { Chats, Messages, NewChat, User } from "../../types";
import { USER_CHATS, ALL_USERS, NEW_CHAT, NEW_USER, USER_BY_ID, ALL_MESSAGES, NEW_MESSAGE, ALL_CHATS, USER_FILTER } from '../actions/actions'

interface Reducer {
    users: User[],
    newUser: User[]
    chats: Chats[]
    newChat: NewChat[]
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
    searchUser: []
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
    callback.addCase(NEW_CHAT.fulfilled, (state,action) =>{
        state.newChat = state.newChat?.concat(action.payload)
    })
    callback.addCase(USER_BY_ID.fulfilled, (state, action) => {
        state.users = action.payload
    })
    callback.addCase(ALL_MESSAGES.fulfilled,(state,action) => {
        state.messages = action.payload
    })
    callback.addCase(NEW_MESSAGE.fulfilled, (state, action) => {
        state.messages = state.messages?.concat(action.payload)
    })
    callback.addCase(USER_FILTER.fulfilled, (state, action) => {
        state.searchUser = action.payload
    })
})
