import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { User } from '../../types'

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
    'NEW_USER', async (user: User) => {
        try {
            const apiData = await axios.post('http://localhost:3001/users', user)
            return apiData.data
        } catch (error) {
            console.log(error)   
        }
    }
)