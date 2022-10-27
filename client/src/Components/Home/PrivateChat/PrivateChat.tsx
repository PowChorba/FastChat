
import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import { ALL_MESSAGES, USER_CHATS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { GetMessageData, User } from "../../../types"
import s from './PrivateChat.module.css'

interface Props {
    chatUser: User[]  
    currentUser: User 
}

export default function PrivateChat({chatUser, currentUser}: Props ) {
    const socket:any = useRef()
    const [messageReceived, setMessageReceived] = useState({
        senderId: "",
        text: "",
        senderChat: ""
        // createdAt: ""
    })
    const secondUserId = chatUser.find((e) => e._id !== currentUser?._id)
    let allChats = useAppSelector(state => state.clientReducer.userChats)
    const dispatch = useAppDispatch()
    let allMessages = useAppSelector(state => state.clientReducer.messages)
    allChats = allChats.filter(e => e.chatsUsers[0]._id === secondUserId?._id || e.chatsUsers[1]._id === secondUserId?._id )
    // console.log(allChats)
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

    useEffect(() => {
        socket.current = io('ws://localhost:3002')
        console.log(socket.current)
        socket.current?.on('getMessage', (data: GetMessageData) => {
            setMessageReceived({
                senderId: data.senderId,
                text: data.text,
                senderChat: data.senderChat
            })
            console.log("DATA",data)
        })
    }, [])
    // console.log("message",messageReceived)
    return(
        <div className={s.chat}>
            <img src={secondUserId?.image} alt="asd" width='50px' className={s.imagen}/>
                <div className={s.overFlow}>
                    <span>{secondUserId?.nickName}  </span>
                    <p className={s.lastMessage}>{messageReceived.text ? messageReceived.text : allMessages[allMessages.length -1]?.textMessage}</p>
                </div>
                <span>{allMessages.length !== 0 ? newDate(allMessages[allMessages.length -1]?.createdAt) : <p></p>}</span>
        </div>)
}