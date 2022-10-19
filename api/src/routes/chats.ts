import {Request, Response} from 'express'
import { Chats } from '../models/chats'
import { ChatsType } from '../types'

export const newChat = async (req: Request,res: Response) => {
    const { firstUser, secondUser } = req.body
    try {
        const alreadyChatOne = await Chats.findOne({
            chatsUsers: [firstUser, secondUser]
        })
        const alreadyChatTwo = await Chats.findOne({
            chatsUsers: [secondUser, firstUser]
        })
        if(alreadyChatOne || alreadyChatTwo){
            return res.send('You have already created a chat with that user')
        }else {
            const newChat = await Chats.create({
                chatsUsers: [firstUser, secondUser]
            })
            return res.json({msg: 'Ok', newChat})
        }
    } catch (error) {
        console.log(error)       
    }
}

export const allChats =async (req: Request, res:Response) => {
    try {
        const allChats = await Chats.find()
        res.send(allChats)
    } catch (error) {
        console.log(error)
    }
}

export const userChat =async (req: Request, res: Response) => {
    const {userId} = req.params
    try {
        const userChats = await Chats.find({
            chatsUsers: { $in: [userId]}
        })
        res.send(userChats)
    } catch (error) {
        console.log(error)
    }
}

export const deleteChat =async (req:Request, res: Response) => {
    const { chatId } = req.params
    try {
        const findChat = await Chats.findById(chatId)
        if(findChat){
            findChat.deleteOne({_id : chatId})
        }
    } catch (error) {
        console.log(error)
    }
}