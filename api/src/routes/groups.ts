import { Request, Response } from 'express'
import { Groups } from '../models/groups'

export const newGroup = async (req: Request, res: Response) => {
    const { groupName, members, admin } = req.body
    try {
        const groupsCreated = await Groups.create({
            groupName,
            members,
            admin
        })
        res.json({ ok: true, message: groupsCreated })
    } catch (e) {
        res.json({ ok: false, message: e })
    }
}
export const updateGroup = async (req: Request, res: Response) => {
    const { groupId, members, admin, groupName, leaveGroup, removeAdmin } = req.body
    try {
        const groupSearch = await Groups.findById(groupId)
        if (groupSearch) {
            if (members) {
                await groupSearch.updateOne({ $push: { members: members } })
                return res.json({ ok: true, msg: "succesfully updated" })
            }
            if (admin) {
                await groupSearch.updateOne({ $push: { admin: admin } })
                return res.json({ ok: true, msg: "succesfully updated" })
            }
            if (groupName) {
                await groupSearch.updateOne({ groupName })
                return res.json({ ok: true, msg: "succesfully updated" })
            }
            if (leaveGroup){
                await groupSearch.updateOne({ $pull: { members: leaveGroup }})
            }if (removeAdmin){
                await groupSearch.updateOne({ $pull: { admin: removeAdmin }})
            }
        } else return res.json({ ok: false, msg: "error" })
    } catch (e) {
        res.status(404).json({ ok: false, msg: e })
    }
}

export const deleteGroup = async (req: Request, res: Response) => {
    const { groupId, userId } = req.body
    try {
        const group = await Groups.findById(groupId)
        const admin = group?.admin?.filter(e=>e.type?._id?.toString() === userId)
        if (admin){
            await group?.delete();
            res.json({ok:true,msg:"deleted succesfully"})
        }
    } catch (e) {
        res.status(404).json({ ok: false, msg: e })
    }
}
export const allGroups = async (req:Request,res:Response)=>{
    try{
        const allGroups = await Groups.find()
        return res.json({ok:true,msg:allGroups})
    }catch(e){
        res.status(404).json({ok:false,msg:"error"})
    }
}