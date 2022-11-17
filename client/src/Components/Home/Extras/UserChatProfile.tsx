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
}

export default function ChatProfile({user, currentChat, currentUser}: Props){
    const dispatch = useAppDispatch()

    const deleteChat = async () => {
        dispatch(DELETE_CHAT(currentChat))
        setTimeout(() => {
            window.location.reload()
        },2000)
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
        dispatch(DELETE_CONTACT(deleteData))
    }

    return(
        <div className={s.contenedor}>
            <img src={user?.image} alt="asd" width='250px' className={s.imagen} onClick={handleOpenImg}/>
            <h4>{user?.nickName}</h4>
            <audio src="blob:http://localhost:3000/12dc14dc-009d-47c2-8b5a-d4e031c64a1a" autoPlay={true}/>
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