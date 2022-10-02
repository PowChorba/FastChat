import { createReducer} from '@reduxjs/toolkit'
import { User } from '../../types'
import { ALL_USERS, NEW_USER } from '../actions/actions'

interface Reducer {
    users?: User[]
    newUser?: User[]
}

const initialState: Reducer = {
    users: [],
    newUser: []
}

export const clientReducer = createReducer(initialState, (callback) => {
    callback.addCase(ALL_USERS.fulfilled,(state, action) => {
        state.users = action.payload
    })
    callback.addCase(NEW_USER.fulfilled,(state, action) => {
        state.newUser = state.newUser?.concat(action.payload)
    })
})