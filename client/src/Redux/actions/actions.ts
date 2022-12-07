import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { CreateGroup, CreateMessages, CreateUser, DeleteUser, Messages, NewChat, UpdateGroup, userDisconnected } from '../../types'

export const ALL_USERS = createAsyncThunk(
    'ALL_USERS', async () => {
        try {
            const apiData = await axios.get('/users')
            return apiData.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const NEW_USER = createAsyncThunk(
    'NEW_USER', async (user: CreateUser) => {
        try {
            const apiData = await axios.post('/users', user)
            return apiData.data
        } catch (error) {
            console.log(error)   
        }
    }
)

export const USER_CHATS = createAsyncThunk(
    'USER_CHATS',async (userId: string | undefined) => {
        try {
            const response = await axios.get(`/chats/${userId}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const USER_FILTER = createAsyncThunk(
    'USER_FILTER',async (nickName: string) => {
        try {
            const response = await axios.get(`/users/?nickName=${nickName}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const USER_CONTACTS = createAsyncThunk(
    'USER_CONTACTS',async (data: any) => {
        try {
            const response = await axios.put('/users', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)


export const NEW_CHAT = createAsyncThunk(
    'NEW_CHAT',async (newChat: NewChat) => {
        try {
            const response = await axios.post('/chats', newChat)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const ALL_CHATS = createAsyncThunk(
    'ALL_CHATS',async () => {
        try {
            const response = await axios.get('/chats')
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const ALL_MESSAGES = createAsyncThunk(
    'ALL_MESSAGES',async () => {
        try {
            const response = await axios.get(`/messages`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const NEW_MESSAGE = createAsyncThunk(
    'NEW_MESSAGE',async (message: CreateMessages) => {
        try {
            const response = await axios.post('/messages', message)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const DELETE_CHAT = createAsyncThunk(
    'DELETE_CHAT',async (chatId: string) => {
        try {
            const response = await axios.delete(`/chats/${chatId}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const DELETE_CONTACT = createAsyncThunk(
    'DELETE_CONTACT' , async (deleteData: DeleteUser) => {
        try {
            const response = await axios.put(`/users`, deleteData)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const BLOCK_USER = createAsyncThunk(
    'BLOCK_USER',async (data: any) => {
        try {
            const response = await axios.put('/users', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const UNBLOCK_USER = createAsyncThunk(
    'UNBLOCK_USER', async (data: object) => {
        try {
            const response = await axios.put('/users', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)
export const CLEAR_RESPONSE = createAsyncThunk(
    'CLEAR_RESPONSE', async () => {
            return ""
    }
)

export const DELETE_MESSAGE = createAsyncThunk(
    'DELETE_MESSAGE', async (messageId: string) => {
        let data = {messageId}
        try {
            const response = await axios.put('/messages', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const ALL_GROUPS_CHATS = createAsyncThunk(
    'ALL_GROUPS_CHATS', async () => {
        try {
            const response = await axios.get('/groups')
            return response.data.msg
        } catch (error) {
            console.log(error)
        }
    }
)


export const CREATE_GROUP_CHAT = createAsyncThunk(
    'CREATE_GROUP_CHAT',async (data: CreateGroup) => {
        try {
            const response = await axios.post('/chats', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const UPDATE_GROUP = createAsyncThunk(
    'UPDATE_GROUP',async (data: UpdateGroup) => {
        try {
            const response = await axios.put('/chats', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)
export const CHANGE_IMG = createAsyncThunk(
    'CHANGE_IMG',async (data: UpdateGroup) => {
        try {
            const response = await axios.put('/chats', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)
export const SET_ADMIN = createAsyncThunk(
    'SET_ADMIN',async (data: UpdateGroup) => {
        try {
            const response = await axios.put('/chats', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)
export const REMOVE_ADMIN = createAsyncThunk(
    'REMOVE_ADMIN',async (data: UpdateGroup) => {
        try {
            const response = await axios.put('/chats', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)
export const ADD_USER = createAsyncThunk(
    'ADD_USER',async (data: UpdateGroup) => {
        try {
            const response = await axios.put('/chats', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)
export const REMOVE_USER = createAsyncThunk(
    'REMOVE_USER',async (data: UpdateGroup) => {
        try {
            const response = await axios.put('/chats', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)
export const LEAVE_GROUP = createAsyncThunk(
    'LEAVE_GROUP',async (data: UpdateGroup) => {
        try {
            const response = await axios.put('/chats', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const LAST_MESSAGE = createAsyncThunk(
    'LAST_MESSAGE', (data: Messages) => {
        return data
    }
)
export const LAST_CONNECTION = createAsyncThunk(
    'LAST_CONNECTION', (data: userDisconnected) => {
        return data
    }
)

 
export const DELETE_NOTIFICATIONS = createAsyncThunk(
    'DELETE_NOTIFICATIONS',async (data: string) => {
        try {
            let chatId = {chatId: data}
            const response = await axios.put('/messages/notification', chatId)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)
