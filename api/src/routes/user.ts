import {Request, Response} from 'express'
import { Users } from '../models/users'
import { User } from '../types'


export const newUser = async (req: Request, res: Response) => {
    const { nickName, userEmail, password, image } = req.body
    try {
        const newUser: User = await Users.create({
            nickName,
            userEmail,
            password,
            image
        })
        res.status(201).json({msg: 'Created', newUser})
    } catch (error) {
        console.log(error)
    }
}

export const allUsers = async (_req: Request, res: Response) => {
    try {
        const allUsers = await Users.find()
        res.json(allUsers)
    } catch (error) {
        console.log(error)
    }
}

