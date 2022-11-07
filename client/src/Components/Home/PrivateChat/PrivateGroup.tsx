import { CombinedChats, User } from "../../../types"
import s from './PrivateChat.module.css'


interface Props {
    currentUser: User
    socket: any
    groupChat: CombinedChats
}

export default function PrivateGroup({currentUser, socket, groupChat}: Props){
    return(
        <div className={s.chat}>
            <img src={groupChat.img} alt="asd" className={s.imagen}/>
        </div>)
}