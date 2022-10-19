import {Request, Response} from 'express'
import { Users } from '../models/users'

export const newUser = async (req: Request, res: Response) => {
    const { nickName, userEmail, password, image } = req.body
    try {
        const newUser = await Users.create({
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

export const allUsers = async (req: Request, res: Response) => {
    const { nickName } = req.query
    try {
        if(nickName){
            const findUser = await Users.findOne({nickName: nickName}).populate('contacts')
            if(findUser){
                return res.send([findUser])
            }else {
                return res.send('We could not find that user')
            }
        }else {
            const allUsers = await Users.find().populate('contacts')
            return res.json(allUsers)
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateUsers = async (req: Request, res: Response) => {
    const { userId,contactId, contact, nickName,password,image } = req.body
    try {
        const findUser = await Users.findById(userId).populate('contacts')
        const findUserDos = await Users.findById(contact)
        const alreadyAdded = findUser?.contacts?.filter(e => e._id?.toString() === contact)
        if(findUser && findUserDos) {
            if(alreadyAdded?.length !== 0) {
                return res.send('Contact already on list')
            }else {
                await findUser.updateOne({$push: {contacts: contact}})
                return res.send(findUser)
            }
        }else if(!contact && findUser && !contactId){
            await findUser.updateOne({image,password,nickName})
            return res.send('User updated')
        }else if(findUser && contactId){
            const filterContact = findUser.contacts?.filter(e => e._id?.toString() === contactId)
            if(filterContact?.length === 1){
                await findUser.updateOne({$pull: {contacts: contactId}})
                return res.send('Contact deleted successfully')
            }else {
                return res.send('Esta rompiendo')
            }
        }
        else{
            return res.send('We could not find that user')
        }
    } catch (error) {
        return console.log(error)
    }
}

export const userById =async (req: Request, res: Response) => {
    const { userId } = req.params
    try {
        const findUser = await Users.findById(userId)
        if(findUser){
            return res.send(findUser)
        }else{
            return res.json({msg: 'We could not find that user'})
        }
    } catch (error) {
        console.log(error)
    }
}

// export const updateUsers =async (req: Request, res: Response) => {
//     const { userId, contactId} = req.body
//     try {
//         const findUser = await Users.findById(userId)
//         if(findUser) {
//             const filterContact = findUser.contacts?.filter(e => e._id?.toString() === contactId)
//             if(filterContact?.length === 1){
//                 await findUser.updateOne({$pull: {contacts: contactId}})
//                 return res.send('Contact deleted successfully')
//             }else {
//                 return res.send('Esta rompiendo')
//             } 
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }

