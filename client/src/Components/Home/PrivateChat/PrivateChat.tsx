
import { useEffect, useState } from "react"
import { ALL_MESSAGES, USER_CHATS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { Chats, GetMessageData, Messages, User } from "../../../types"
import s from './PrivateChat.module.css'

interface Props {
    chatUser: User[]  
    currentUser: User 
    socket: any
    allChatData: Chats
}

export default function PrivateChat({chatUser, currentUser, socket, allChatData}: Props ) {
    const [messageReceived, setMessageReceived] = useState({
        senderId: "",
        text: "",
        senderChat: ""
    })
    let [contador, setContador] = useState(0)
    const [inaki, setInaki] = useState<Messages[]>([])
    const [writting, setWritting] = useState(false)
    //PARA AGARRAR MENSAJES DE CADA CHAT
    const secondUserId = chatUser.find((e) => e._id !== currentUser?._id)
    // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
    let allChats = useAppSelector(state => state.clientReducer.userChats)
    const dispatch = useAppDispatch()
    let allMessages = useAppSelector(state => state.clientReducer.messages)
    // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
    allChats = allChats.filter(e => e.chatsUsers[0]?._id === secondUserId?._id || e.chatsUsers[1]?._id === secondUserId?._id )
    allMessages = allMessages.filter(e => e.chatId === allChatData?._id)
    
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
        socket.current?.on('getMessage', (data: GetMessageData) => {
            console.log(data)
            setMessageReceived({
                senderId: data.senderId,
                text: data.text,
                senderChat: data.senderChat
            })
            setInaki((prev: Messages[]) => [...prev, {
                _id: contador.toString(),
                textMessage: data.text,
                messageAuthor: data.senderChat,
                // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
                chatId: allChats[0]?._id,
                createdAt: new Date().toISOString(),
            }])
        })
        setContador(contador++)
        socket.current?.on("getUserWritting",(data: GetMessageData)=>{
            // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
            if(data.senderChat === allChats[0]?._id){
                if (data.text) setWritting(true)
                else setWritting(false)
            }
        })
    }, [socket, allChats, contador])

    //PARA RENDERIZAR EL ULTIMO MENSAJE DE SOCKET
    if(messageReceived.text !== "" && allChats[0]?._id === messageReceived.senderChat ){
        if(!allMessages.includes(inaki[0])){
            allMessages = [...allMessages,...inaki]
        }
        allMessages = allMessages.sort((a,b)=>{
            if (a.createdAt < b.createdAt) return -1
            if (a.createdAt > b.createdAt) return 1
            else return 0
        })
    }

    return(
        <div className={s.chat}>
            <img src={allChatData.img ? allChatData.img : secondUserId?.image} alt="asd" width='50px' className={s.imagen}/>
                <div className={s.overFlow}>
                    <span>{allChatData.groupName ? allChatData.groupName : secondUserId?.nickName}</span>
                    {
                        writting ? <p className={s.writtingMessage}>Writting...</p>
                        : <p className={s.lastMessage}>{allMessages[allMessages.length -1]?.textMessage }</p>
                    }
                </div>
                <span>{allMessages.length !== 0 ? newDate(allMessages[allMessages.length -1]?.createdAt) : <p></p>}</span>
        </div>)
}




