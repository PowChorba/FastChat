import {Request, Response} from 'express'
import { Chats } from '../models/chats'

export const newChat = async (req: Request,res: Response) => {
    const { firstUser, secondUser, groupName, chatsUsersId , admin, img } = req.body
    try {
        const alreadyChatOne = await Chats.findOne({
            chatsUsers: [firstUser, secondUser]
        })
        const alreadyChatTwo = await Chats.findOne({
            chatsUsers: [secondUser, firstUser]
        })
        if(!firstUser && !secondUser){
            const groupsCreated = await Chats.create({
                groupName,
                chatsUsers: [chatsUsersId],
                admin,
                img
            })
            res.json({ ok: true, message: groupsCreated })
        }
        else if(alreadyChatOne || alreadyChatTwo){
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
    const { chatId, userId } = req.params
    try {
        const findChat = await Chats.findById(chatId)
        const admin = findChat?.admin?.filter(e=> e._id?.toString() === userId)
        if(findChat && admin){
            findChat.deleteOne({_id : chatId})
        }else if(findChat && !admin){
            return res.send('Must be admin to delete group')
        }else {
            findChat?.deleteOne({_id : chatId})
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateGroup = async (req: Request, res: Response) => {
    const { groupId, members, admin, groupName, leaveGroup, removeAdmin } = req.body
    try {
        const groupSearch = await Chats.findById(groupId)
        if (groupSearch) {
            if (members) {
                await groupSearch.updateOne({ $push: { chatsUsers: members } })
                return res.json({ ok: true, msg: "succesfully updated" })
            }
            else if (admin) {
                await groupSearch.updateOne({ $push: { admin: admin } })
                return res.json({ ok: true, msg: "succesfully updated" })
            }
            else if (groupName) {
                await groupSearch.updateOne({ groupName })
                return res.json({ ok: true, msg: "succesfully updated" })
            }
            else if (leaveGroup){
                await groupSearch.updateOne({ $pull: { chatsUsers: leaveGroup }})
                return res.json({ ok: true, msg: "succesfully removed" })
            }else if (removeAdmin){
                await groupSearch.updateOne({ $pull: { admin: removeAdmin }})
                return res.json({ ok: true, msg: "succesfully removed" })
            }
        } else return res.json({ ok: false, msg: "error" })
    } catch (e) {
        res.status(404).json({ ok: false, msg: e })
    }
}