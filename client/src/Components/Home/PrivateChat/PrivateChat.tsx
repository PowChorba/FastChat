
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { BiCircle, BiImageAlt } from "react-icons/bi"
import { DELETE_NOTIFICATIONS, USER_CHATS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { Chats, GetMessageData, Messages, User } from "../../../types"
import s from './PrivateChat.module.css'
import { BsMicFill } from 'react-icons/bs'
import { fechasMensajes } from "../Tools/Tools"
interface Props {
    chatUser: User[]
    currentUser: User
    socket: any
    allChatData: Chats
    allMessages: Messages[]
    setPendingMessages: Dispatch<SetStateAction<Messages[]>>
    currentChat: string
}

export default function PrivateChat({ currentChat, chatUser, currentUser, socket, allChatData, setPendingMessages, allMessages }: Props) {
    const [messageReceived, setMessageReceived] = useState({
        senderId: "",
        text: "",
        senderChat: ""
    })
    const [inaki, setInaki] = useState<Messages[]>([])
    const [writting, setWritting] = useState(false)
    const [sendingAudio, setSendingAudio] = useState(false)
    //PARA AGARRAR MENSAJES DE CADA CHAT
    const secondUserId = chatUser.find((e) => e._id !== currentUser?._id)
    // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
    let allChats = useAppSelector(state => state.clientReducer.userChats)
    const dispatch = useAppDispatch()
    // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
    allChats = allChats.filter(e => e.chatsUsers[0]?._id === secondUserId?._id || e.chatsUsers[1]?._id === secondUserId?._id)
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
            setMessageReceived({
                senderId: data.senderId,
                text: data.text,
                senderChat: data.senderChat
            })

                setNotificationCounter((prevNumber) => {
                    return prevNumber + 1
                })

            setPendingMessages((prevState) => {
                let getSocketMessage = prevState.filter(msg => msg._id !== data.messageId)
                getSocketMessage.push({
                    _id: data.messageId,
                    textMessage: data.text,
                    messageAuthor: data.senderId,
                    chatId: data.senderChat,
                    isImage: data?.isImage,
                    createdAt: new Date().toISOString(),
                    isAudio: data.isAudio
                })
                return getSocketMessage
            })

            setInaki((prev: Messages[]) => [...prev, {
                _id: data.messageId,
                textMessage: data.text,
                messageAuthor: data.senderChat,
                // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
                chatId: allChats[0]?._id,
                isImage: data?.isImage,
                createdAt: new Date().toISOString(),
                isAudio: data?.isAudio
            }])
        }
    })
    socket.current?.on("getUserWritting", (data: GetMessageData) => {
        // CAPAZ SE PUEDE MODIFICAR !!!!!!!!!!!!!!
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
}, [socket, setPendingMessages])


//PARA RENDERIZAR EL ULTIMO MENSAJE DE SOCKET
if (messageReceived.text !== "" && allChatData._id === messageReceived.senderChat) {
    if (!allMessages.includes(inaki[0])) {
        allMessages = [...allMessages, ...inaki]
    }
    allMessages = allMessages.sort((a, b) => {
        if (a.createdAt < b.createdAt) return -1
        if (a.createdAt > b.createdAt) return 1
        else return 0
    })
}

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
