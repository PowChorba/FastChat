import  {Request, Response} from 'express'
import { Chats } from '../models/chats'

export const newChat = async (req: Request,res: Response) => {
    const { firstUser, secondUser, groupName, chatsUsersId , admin, creator , img, _id } = req.body
    try {
        const alreadyChatOne = await Chats.findOne({
            chatsUsers: [firstUser, secondUser]
        })
        const alreadyChatTwo = await Chats.findOne({
            chatsUsers: [secondUser, firstUser]
        })
        if(!firstUser && !secondUser){
            const groupsCreated = await Chats.create({
                _id,
                groupName,
                creator,
                chatsUsers: [chatsUsersId],
                admin,
                img
            })
            res.json({ ok: true, msg:"succesfully created" ,chat: groupsCreated })
        }
        else if(alreadyChatOne || alreadyChatTwo){
            return res.json({ok:true, msg:'Chat already created'})
        }else {
            const newChat = await Chats.create({
                _id,
                chatsUsers: [firstUser, secondUser]
            })
            return res.json({ok:true,msg: "succesfully created", chat:newChat})
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
            return res.json({ok:true ,chatId , msg:'Chat deleted successfully'})
        }
    } catch (error) {
        res.json({ok:false, msg: "error"})
    }
}

export const updateGroup = async (req: Request, res: Response) => {
    const { groupId, members, admin, groupName, leaveGroup, removeAdmin, img } = req.body
    try {
        const groupSearch = await Chats.findById(groupId)
        if (groupSearch) {
            if (members) {
                await groupSearch.updateOne({ $push: { chatsUsers: members } })
                return res.json({ ok: true, msg: "succesfully updated", groupId, members })
            }
            else if (admin) {
                await groupSearch.updateOne({ $push: { admin: admin } })
                return res.json({ ok: true, msg: "succesfully updated", groupId, admin })
            }
            else if (groupName) {
                await groupSearch.updateOne({ groupName })
                return res.json({ ok: true, msg: "succesfully updated", groupId, groupName })
            }
            else if (leaveGroup){
                await groupSearch.updateOne({ $pull: { chatsUsers: leaveGroup }})
                return res.json({ ok: true, msg: "succesfully leave group", groupId, leaveGroup })
            }else if (removeAdmin){
                await groupSearch.updateOne({ $pull: { admin: removeAdmin }})
                return res.json({ ok: true, msg: "succesfully removed", groupId, removeAdmin })
            }else if (img){
                await groupSearch.updateOne({ img })
                return res.json({ok:true, msg:"Image change succesfully", img, groupId})
            }
        } else return res.json({ ok: false, msg: "error" })
    } catch (e) {
        res.status(404).json({ ok: false, msg: e })
    }
}