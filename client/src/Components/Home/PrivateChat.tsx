
import { User } from "../../types"
import s from './Css/PrivateChat.module.css'

interface Props {
    chatUser: User[]  
    currentUser: User | undefined
}

export default function PrivateChat({chatUser, currentUser}: Props ) {
    const secondUserId = chatUser.find((e) => e._id !== currentUser?._id)
    
    return(
        <div className={s.chat}>
            <img src={secondUserId?.image} alt="asd" width='48px' className={s.imagen}/>
            <span>{secondUserId?.nickName}</span>
        </div>)
}