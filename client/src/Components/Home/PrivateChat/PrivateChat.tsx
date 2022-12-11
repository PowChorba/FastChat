
import { useEffect, useState } from "react"
import { BiCircle, BiImageAlt } from "react-icons/bi"
import { DELETE_NOTIFICATIONS, DELETE_SOCKET_MESSAGE, RECEIVE_SOCKET_MESSAGE, USER_CHATS } from "../../../Redux/actions/actions"
import { useAppDispatch } from "../../../Redux/hooks"
import { Chats, GetMessageData, GetMessageDeleted, Messages, User } from "../../../types"
import s from './PrivateChat.module.css'
import { BsMicFill } from 'react-icons/bs'
import { fechasMensajes } from "../Tools/Tools"
interface Props {
    chatUser: User[]
    currentUser: User
    socket: any
    allChatData: Chats
    allMessages: Messages[]
    currentChat: string
}

export default function PrivateChat({ currentChat, chatUser, currentUser, socket, allChatData, allMessages }: Props) {
    const [writting, setWritting] = useState(false)
    const [sendingAudio, setSendingAudio] = useState(false)
    //PARA AGARRAR MENSAJES DE CADA CHAT
    const secondUserId = chatUser.find((e) => e._id !== currentUser?._id)
    // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
    const dispatch = useAppDispatch()
    // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
    allMessages = allMessages.filter(e => e.chatId === allChatData?._id)
    // PARA NOTIFICACIONES 
    const [notificationCounter, setNotificationCounter] = useState(0)
    if (currentChat === allChatData._id && notificationCounter > 0){
        setNotificationCounter(0)
    }
    let count = 0
    allMessages.forEach((msg) => {
        if (msg.messageAuthor !== currentUser._id) {
            return msg.notification === true ? count++ : ""
        }
    })

    let numberOfNotifications = count + notificationCounter

    const notificationAudio = () => {
        let audio = new Audio(require("../../../assets/notification.wav"))
        audio.play()
    
    }
    const notificationsOff = () => {
        setNotificationCounter(prevNumber=>prevNumber = 0)
        dispatch(DELETE_NOTIFICATIONS(allChatData._id))
    }
    // ----------------------------------------------

    useEffect(() => {
        if (currentUser?._id) dispatch(USER_CHATS(currentUser._id))
    }, [dispatch, currentUser?._id])

useEffect(() => {
    // SOCKET MESSAGE RECEIVED 
    socket.current?.on('getMessage', (data: GetMessageData) => {
        if (data.senderChat === allChatData._id) {
            // NOTIFICATION SOUND 
            notificationAudio()
            // ----------------
                setNotificationCounter((prevNumber) => {
                    return prevNumber + 1
                })
                dispatch(RECEIVE_SOCKET_MESSAGE({
                    _id: data.messageId,
                   textMessage: data.text,
                   messageAuthor: data.senderId,
                   chatId: data.senderChat,
                   isImage: data.isImage,
                   createdAt: new Date().toISOString(),
                   isAudio: data.isAudio}))
        }
    })
    socket.current?.on("getDeleteMessage", (data: GetMessageDeleted) => {
        if (data.senderChat === currentChat) {
            dispatch(DELETE_SOCKET_MESSAGE({
                _id: data.messageId,
                textMessage: "Message Deleted",
                messageAuthor: data.senderId,
                chatId: data.senderChat,
                createdAt: data.createdAt,
                isDeleted: true
            }))
        }
    })
    socket.current?.on("getUserWritting", (data: GetMessageData) => {
        if (data.senderChat === allChatData._id) {
            if (data.type === "text") {
                if (data.text) setWritting(true)
                else setWritting(false)
            } else if (data.type === "audio") {
                if (data.text) setSendingAudio(true)
                else setSendingAudio(false)
            }
        }
    })
    if (allChatData.groupName) {
        socket.current?.emit("join_room", {
            room: allChatData?._id,
            userId: currentUser?._id
        })
    }
}, [socket.current])

return (
    <div onClick={() => notificationsOff()} className={s.chat}>
        <img src={allChatData.img ? allChatData.img : secondUserId?.image} alt="asd" width='50px' className={s.imagen} />
        <div className={s.overFlow}>
            <span>{allChatData.groupName ? allChatData?.groupName : secondUserId?.nickName}</span>
            {
                writting && !allChatData.groupName ? <p className={s.writtingMessage}>Writting...</p>
                    : sendingAudio && !allChatData.groupName ? <p className={s.writtingMessage}>Sending audio...</p> :
                        <div>
                            {
                                allMessages[allMessages?.length - 1]?.isImage
                                    ? <div className={s.lastImage}><BiImageAlt />Image</div>
                                    : allMessages[allMessages?.length - 1]?.isAudio
                                        ? <div className={s.lastImage}><BsMicFill />Audio</div>
                                        : <div> <p className={s.lastMessage}>{allMessages[allMessages.length - 1]?.textMessage}</p></div>
                            }
                        </div>
            }
        </div>
        <span>{(numberOfNotifications > 0 && currentChat !== allChatData._id )
        ? <div>
            <p className={s.fechaMensajes}>{fechasMensajes(allMessages[allMessages.length - 1]?.createdAt)}</p>
            <div className={s.divNotification}>
            <BiCircle className={s.notificationColor}/> 
            <span className={s.notificationNumber}>{numberOfNotifications}</span>
            </div>
        </div>
        : allMessages.length !== 0 && fechasMensajes(allMessages[allMessages.length - 1]?.createdAt)}</span>
    </div>)
}
