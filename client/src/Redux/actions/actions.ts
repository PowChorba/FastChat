import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { CreateGroup, CreateMessages, CreateUser, DeleteUser, NewChat, UpdateGroup } from '../../types'

export const ALL_USERS = createAsyncThunk(
    'ALL_USERS', async () => {
        try {
            const apiData = await axios.get('http://localhost:3001/users')
            return apiData.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const NEW_USER = createAsyncThunk(
    'NEW_USER', async (user: CreateUser) => {
        try {
            const apiData = await axios.post('http://localhost:3001/users', user)
            return apiData.data
        } catch (error) {
            console.log(error)   
        }
    }
)

export const USER_BY_ID = createAsyncThunk(
    'USER_BY_ID', async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost3001/users/${userId}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const USER_CHATS = createAsyncThunk(
    'USER_CHATS',async (userId: string | undefined) => {
        try {
            const response = await axios.get(`http://localhost:3001/chats/${userId}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const USER_FILTER = createAsyncThunk(
    'USER_FILTER',async (nickName: string) => {
        try {
            const response = await axios.get(`http://localhost:3001/users/?nickName=${nickName}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const USER_CONTACTS = createAsyncThunk(
    'USER_CONTACTS',async (data: any) => {
        try {
            const response = await axios.put('http://localhost:3001/users', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)


export const NEW_CHAT = createAsyncThunk(
    'NEW_CHAT',async (newChat: NewChat) => {
        try {
            const response = await axios.post('http://localhost:3001/chats', newChat)
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const ALL_CHATS = createAsyncThunk(
    'ALL_CHATS',async () => {
        try {
            const response = await axios.get('http://localhost:3001/chats')
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const ALL_MESSAGES = createAsyncThunk(
    'ALL_MESSAGES',async () => {
        try {
            const response = await axios.get(`http://localhost:3001/messages`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const NEW_MESSAGE = createAsyncThunk(
    'NEW_MESSAGE',async (message: CreateMessages) => {
        try {
            const response = await axios.post('http://localhost:3001/messages', message)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const DELETE_CHAT = createAsyncThunk(
    'DELETE_CHAT',async (chatId: string) => {
        try {
            const response = await axios.delete(`http://localhost:3001/chats/${chatId}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const DELETE_CONTACT = createAsyncThunk(
    'DELETE_CONTACT' , async (deleteData: DeleteUser) => {
        try {
            const response = await axios.put(`http://localhost:3001/users`, deleteData)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const BLOCK_USER = createAsyncThunk(
    'BLOCK_USER',async (data: any) => {
        try {
            const response = await axios.put('http://localhost:3001/users', data)
            // console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const UNBLOCK_USER = createAsyncThunk(
    'UNBLOCK_USER', async (data: object) => {
        try {
            const response = await axios.put('http://localhost:3001/users', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const DELETE_MESSAGE = createAsyncThunk(
    'DELETE_MESSAGE', async (messageId: string) => {
        let data = {messageId}
        try {
            const response = await axios.put('http://localhost:3001/messages', data)
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const ALL_GROUPS_CHATS = createAsyncThunk(
    'ALL_GROUPS_CHATS', async () => {
        console.log( 'asd')
        try {
            const response = await axios.get('http://localhost:3001/groups')
            return response.data.msg
        } catch (error) {
            console.log(error)
        }
    }
)


export const CREATE_GROUP_CHAT = createAsyncThunk(
    'CREATE_GROUP_CHAT',async (data: CreateGroup) => {
        try {
            const response = await axios.post('http://localhost:3001/chats', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const UPDATE_GROUP = createAsyncThunk(
    'ADD_USER_GROUP',async (data: UpdateGroup) => {
        try {
            console.log(data)
            const response = await axios.put('http://localhost:3001/chats', data)
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)
export const DELETE_NOTIFICATIONS = createAsyncThunk(
    'DELETE_NOTIFICATIONS',async (data: string) => {
        try {
            console.log(data)
            let chatId = {chatId: data}
            const response = await axios.put('http://localhost:3001/messages/notification', chatId)
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
)