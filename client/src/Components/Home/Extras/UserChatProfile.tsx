import { User } from "../../../types"
import { Button } from "@chakra-ui/react"
import s from './ChatProfile.module.css'
import { useAppDispatch } from "../../../Redux/hooks"
import { DELETE_CHAT } from "../../../Redux/actions/actions"

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
    
    return(
        <div className={s.contenedor}>
            <img src={user?.image} alt="asd" width='250px' className={s.imagen}/>
            <h4>{user?.nickName}</h4>
            <p>{user?.userEmail}</p>
            <div>
            <Button colorScheme='red' variant='outline' onClick={deleteChat}>Delete chat</Button>
            </div>          
        </div>)
}