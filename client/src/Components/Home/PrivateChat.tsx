import { useAppSelector } from "../../Redux/hooks"
import { User } from "../../types"
import s from './Css/PrivateChat.module.css'

interface Props {
    chatUser: string[] 
    currentUser: User | undefined
}

export default function PrivateChat({chatUser, currentUser}: Props ) {
    const user = useAppSelector(state => state.clientReducer.users)
    const secondUserId = chatUser.find((e: string) => e !== currentUser?._id)
    const userFriend = user?.find(e => e._id === secondUserId)

    console.log(chatUser)
    
    return(
        <div className={s.chat}>
            <img src={userFriend?.image} alt="asd" width='48px' className={s.imagen}/>
            <span>{userFriend?.nickName}</span>
        </div>)
}