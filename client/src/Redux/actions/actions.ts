import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { CreateMessages, CreateUser, Messages, NewChat } from '../../types'

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