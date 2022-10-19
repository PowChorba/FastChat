import { User } from "../../../types"
import { Button } from "@chakra-ui/react"
import s from './ChatProfile.module.css'
import { useAppDispatch } from "../../../Redux/hooks"
import { DELETE_CHAT, DELETE_CONTACT } from "../../../Redux/actions/actions"
import { useState } from "react"

interface Props {
    user: User
    currentChat: string
    currentUser: User
}

export default function ChatProfile({user, currentChat, currentUser}: Props){
    const dispatch = useAppDispatch()
    const [deleteData, setDeleteContacts] = useState({
        userId: '',
        contactId: ''
    })

    const deleteChat = async () => {
        dispatch(DELETE_CHAT(currentChat))
        setTimeout(() => {
            window.location.reload()
        },2000)
    }
    
    const loadData = () => {
        setDeleteContacts({
            userId: currentUser?._id,
            contactId: user?._id
        })
    }

    const deleteContact = async () => {
        dispatch(DELETE_CONTACT(deleteData))
    }

    return(
        <div className={s.contenedor}>
            <img src={user?.image} alt="asd" width='250px' className={s.imagen}/>
            <h4>{user?.nickName}</h4>
            <p>{user?.userEmail}</p>
            <div>
            <Button colorScheme='red' variant='outline' onClick={deleteChat}>Delete chat</Button>
            </div>
            <Button colorScheme='red' variant='outline' onMouseEnter={loadData} onClick={deleteContact}>Remove contact</Button>            
        </div>)
}