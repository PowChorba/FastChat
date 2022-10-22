
import { useEffect } from "react"
import { ALL_MESSAGES, USER_CHATS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { User } from "../../../types"
import s from './PrivateChat.module.css'

interface Props {
    chatUser: User[]  
    currentUser: User 
}

export default function PrivateChat({chatUser, currentUser}: Props ) {
    const secondUserId = chatUser.find((e) => e._id !== currentUser?._id)
    let allChats = useAppSelector(state => state.clientReducer.userChats)
    const dispatch = useAppDispatch()
    let allMessages = useAppSelector(state => state.clientReducer.messages)
    allChats = allChats.filter(e => e.chatsUsers[0]._id === secondUserId?._id || e.chatsUsers[1]._id === secondUserId?._id )
    allMessages = allMessages.filter(e => e.chatId === allChats[0]?._id)

    const newDate = (e: string) => {
        const date = new Date(e)
        const hours = date.getHours()
        let minutes = date.getMinutes()
        if(minutes < 10) return (hours + ':0' + minutes)
        return (hours + ':' + minutes)
    }

    useEffect(() => {
        if(currentUser?._id) dispatch(USER_CHATS(currentUser._id))
        dispatch(ALL_MESSAGES())
    }, [dispatch, currentUser?._id])

    return(
        <div className={s.chat}>
            <img src={secondUserId?.image} alt="asd" width='50px' className={s.imagen}/>
                <div className={s.overFlow}>
                    <span>{secondUserId?.nickName}  </span>
                    <p className={s.lastMessage}>{allMessages[allMessages.length -1]?.textMessage}</p>
                </div>
                <span>{allMessages.length !== 0 ? newDate(allMessages[allMessages.length -1]?.createdAt) : <p></p>}</span>
        </div>)
}