import { User } from "../../../types"
import { Button } from "@chakra-ui/react"
import s from './ChatProfile.module.css'
import { useAppDispatch } from "../../../Redux/hooks"
import { BLOCK_USER, DELETE_CHAT, DELETE_CONTACT } from "../../../Redux/actions/actions"
import { useState } from "react"
import UserPhoto from "../Dialogs/UserPhoto"

interface Props {
    user: User
    currentChat: string
    currentUser: User
    setProfileChat : React.Dispatch<React.SetStateAction<boolean>>
    setCurrentChat: React.Dispatch<React.SetStateAction<string>>
}

export default function ChatProfile({setCurrentChat,user, currentChat, currentUser, setProfileChat}: Props){
    const dispatch = useAppDispatch()

    const deleteChat = async () => {
        dispatch(DELETE_CHAT(currentChat))
        setProfileChat(false)
        setCurrentChat("")
    }
    
    const [openImg, setOpenImg] = useState(false)

    const handleOpenImg = () => {
        setOpenImg(!openImg)
    }

    //BLOQUEAR Usuario
    const [block, setBlock] = useState({
        userId: '',
        bloqUserId: ''
    })

    //PARA BORRAR CONTACTO
    const [deleteData, setDeleteContacts] = useState({
        userId: '',
        contactId: ''
    })
        
    const handleBlockId = (e: string) => {
        if (currentUser?._id) {
            setBlock({
                userId: currentUser._id,
                bloqUserId: e
            })
            setDeleteContacts({
                userId: currentUser?._id,
                contactId: e
            })
        }
    }
        
    const bloqUser = () => {
        dispatch(BLOCK_USER(block))
        setProfileChat(false)
        dispatch(DELETE_CONTACT(deleteData))
        dispatch(DELETE_CHAT(currentChat))
        setCurrentChat("")
    }

    return(
        <div className={s.contenedor}>
            <img src={user?.image} alt="asd" width='250px' className={s.imagen} onClick={handleOpenImg}/>
            <h4>{user?.nickName}</h4>
            <p>{user?.userEmail}</p>
            <div>

            </div>
            <div>
                <Button colorScheme='red' variant='outline' onMouseEnter={() => handleBlockId(user?._id)} onClick={bloqUser}>Block User</Button>  
                <Button colorScheme='red' variant='outline' onClick={deleteChat}>Delete chat</Button>
            </div> 
            {
                openImg ? <UserPhoto setOpenImg={setOpenImg} userImage={user}/> : ''
            }         
        </div>)
}