import { Button, Input } from "@chakra-ui/react"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { BLOCK_USER, DELETE_CHAT, NEW_MESSAGE, USER_CONTACTS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { Chats, GetMessageData, Messages, SocketUser, GetMessageDeleted, User } from "../../../types"
import ChatProfile from "../Extras/UserChatProfile"
import Message from "../Message/Message"
import s from './Chats.module.css'
import { GrClose } from 'react-icons/gr'
import ProfileGroup from "../Extras/ProfileGroup"
import { v4 as uuidv4 } from 'uuid';
interface Props {
    currentUser: User
    currentChat: string
    friendId: User
    socket: any
    allChats: Chats[]
    setPendingMessages: Dispatch<SetStateAction<Messages[]>>
    pendingMessages: Messages[]
}

export default function Chatss({ currentUser, currentChat, friendId, socket, allChats, pendingMessages, setPendingMessages }: Props) {
    const [pows, setPows] = useState(true)
    const [test, setTest] = useState<Messages[]>([])
    const [writting, setWritting] = useState(false)
    const [deleteMessage, setDeleteMessage] = useState<Messages>()
    const scroll = useRef<HTMLDivElement>(null)
    // const [visible, setVisible] = useState(false)
    const dispatch = useAppDispatch()
    const allMessages = useAppSelector(state => state.clientReducer.messages)
    let filterMessages = allMessages?.filter(e => e.chatId === currentChat)
    //PARA PODER RENDERIZAR BIEN LOS GRUPOS
    const filterGroupChat = allChats.filter(e => e._id === currentChat)[0]
    console.log(friendId)

    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: 'smooth'})
    })



    const [messageReceived, setMessageReceived] = useState({
        senderId: "",
        text: "",
        senderChat: "",
        id: ""
    })

    const [messages, setMessages] = useState({
        textMessage: '',
        messageAuthor: '',
        chatId: ''
    })


    const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        socket.current.emit('sendEscribiendo', {
            senderId: currentUser?._id,
            receiverId: friendId?._id,
            text: e.target.value,
            senderChat: currentChat
        })
        setMessages({
            messageAuthor: e.target.id,
            textMessage: e.target.value,
            chatId: currentChat
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let id = uuidv4()
        socket.current.emit('sendEscribiendo', {
            senderId: currentUser?._id,
            receiverId: friendId?._id,
            text: "",
            senderChat: currentChat
        })
        socket.current.emit('sendMessage', {
            senderId: currentUser?._id,
            receiverId: friendId?._id,
            text: messages.textMessage,
            senderChat: currentChat,
            messageId: id,
            isGroup: filterGroupChat?._id
        })
        let messageComplete = {
            textMessage: messages.textMessage,
            messageAuthor: messages.messageAuthor,
            chatId: messages.chatId,
            _id: id
        }

        dispatch(NEW_MESSAGE(messageComplete))
        setMessages({
            textMessage: '',
            messageAuthor: '',
            chatId: ''
        })
    }

    const [profileChat, setProfileChat] = useState(false)

    const handleProfileChat = () => {
        setProfileChat(true)
    }

    const handleCloseProfileChat = () => {
        setProfileChat(false)
    }

    //PROBANDO SI EL USUARIO TIENE A LA PERSONA QUE LE ENVIO EL MENSAJE
    const prueba = currentUser?.contacts?.filter(e => e._id === friendId?._id)

    //ADD CONTACT
    const [contactData, setContactData] = useState({
        userId: '',
        contact: ''
    })

    const handleDataNewContact = (e: string) => {
        if (currentUser?._id) {
            setContactData({
                userId: currentUser._id,
                contact: e
            })
        }
    }

    const handleNewContact = () => {
        dispatch(USER_CONTACTS(contactData))
        setPows(false)
    }

    useEffect(() => {
        let myPendingMsg = pendingMessages.filter(msg=> msg.chatId === currentChat)

        setTest((prevState)=>{
            return [...myPendingMsg,...prevState]
        })
        setPendingMessages((prevState)=>{
            let deletePendingMsg = prevState.filter(msg=> msg.chatId !== currentChat)
            return deletePendingMsg
        })

        setMessageReceived({
            id: myPendingMsg[myPendingMsg.length-1]?._id,
            senderId: myPendingMsg[myPendingMsg.length-1]?.messageAuthor,
            text: myPendingMsg[myPendingMsg.length-1]?.textMessage,
            senderChat: myPendingMsg[myPendingMsg.length-1]?.chatId
        })

        socket.current?.on('getMessage', (data: GetMessageData) => {
            if (data.senderChat === currentChat) {
                setMessageReceived({
                    id: data.messageId || uuidv4(),
                    senderId: data.senderId,
                    text: data.text,
                    senderChat: data.senderChat
                })
                setTest((prevState) => {
                    let getSocketMessage = prevState.filter(msg => msg._id !== data.messageId)
                    getSocketMessage.push({
                        _id: data.messageId,
                        textMessage: data.text,
                        messageAuthor: data.senderId,
                        chatId: data.senderChat,
                        createdAt: new Date().toISOString(),
                    })
                    return getSocketMessage
                })
            }
        })
        socket.current?.on("getDeleteMessage", (data: GetMessageDeleted) => {
            if (data.senderChat === currentChat) {
                setDeleteMessage({
                    _id: data.messageId,
                    textMessage: "Message Deleted",
                    messageAuthor: data.senderId,
                    chatId: data.senderChat,
                    createdAt: data.createdAt,
                    isDeleted: true
                })
            }
            setTest((prevState) => {
                let deleteSocketMessage = prevState.filter(msg => msg._id !== data.messageId)
                deleteSocketMessage.push({
                    _id: data.messageId,
                    textMessage: "Message Deleted",
                    messageAuthor: data.senderId,
                    chatId: data.senderChat,
                    createdAt: data.createdAt,
                    isDeleted: true
                })
                return deleteSocketMessage
            })
        })
    }, [socket, currentChat])

    useEffect(() => {
        socket.current?.on("getUserWritting", (data: GetMessageData) => {
            if (data.senderChat === currentChat) {
                console.log(data)
                if (data.text) setWritting(true)
                else setWritting(false)
            }
        })
    }, [messageReceived, currentChat, socket])
    const [online, setOnline] = useState<string[]>([])

    useEffect(() => {
        socket.current?.on('getUsers', (users: SocketUser[]) => {
            setOnline(users?.map((e) => e.userId))
        })
    }, [currentUser, socket])

    //ARRAY PARA

    const fechaActual = (e: string) => {
        const date = new Date(e)
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }

    const date = new Date()

    const actualDayMessages = filterMessages.filter(e => fechaActual(e.createdAt) === fechaActual(date.toString()))

    // BORRA O AGREGA MENSAJE 
    if (currentChat === messageReceived.senderChat || currentChat === deleteMessage?.chatId) {
        test.forEach((msgState) => {
            filterMessages = filterMessages.filter(ele => ele._id !== msgState._id)
        })
        filterMessages = [...filterMessages, ...test]
    }

    // ORDENA LOS MENSAJES POR FECHA
    filterMessages = filterMessages.sort((a, b) => {
        if (a.createdAt < b.createdAt) return -1
        if (a.createdAt > b.createdAt) return 1
        else return 0
    })

    //BLOQUEAR CONTACTOS
    const [block, setBlock] = useState({
        userId: '',
        bloqUserId: ''
    })

    const handleBlockId = (e: string) => {
        if (currentUser?._id) {
            setBlock({
                userId: currentUser._id,
                bloqUserId: e
            })
        }
    }

    const bloqUser = () => {
        dispatch(BLOCK_USER(block))
        dispatch(DELETE_CHAT(currentChat))
        setTimeout(() => {
            window.location.reload()
        }, 2000)
    }
    return (
        <div>
            {
                currentChat === ''
                    ? <div className={s.divChatsCerrados}>
                        <h4>Open a conversation or start a new one!</h4>
                    </div>
                    :
                    <div className={profileChat ? s.contenedor : s.asd}>
                        <div className={s.divMensajes}>
                            <div className={s.divDatosUserChat} onClick={handleProfileChat}><img src={filterGroupChat?.img ? filterGroupChat?.img : friendId?.image} alt="asd" className={s.imagenes} />
                                <div>
                                    <p>{filterGroupChat.groupName ? filterGroupChat.groupName : friendId?.nickName}</p>
                                    <p className={s.conection}>
                                        {
                                            filterGroupChat.groupName ? <span></span>
                                                : writting ? "Writting..." : (online.filter(e => e === friendId?._id).length === 1 ? 'online' : 'offline')
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className={s.contenedorMensajes}>
                                <div className={s.buttonsAddBloq}>
                                    {
                                        filterGroupChat.groupName ? <span></span>
                                            : prueba?.length !== 0 || !pows ? <span></span>
                                                : <div className={s.divAgregarBloquear}>
                                                    <p>If you know this user, press de <b>Add button</b>. If not, press the <b>Block button</b></p>
                                                    <Button variant='outline' colorScheme='green' onMouseEnter={() => handleDataNewContact(friendId?._id)} onClick={handleNewContact}>Add Contact</Button>{' '}
                                                    <Button variant='outline' colorScheme='red' onMouseEnter={() => handleBlockId(friendId?._id)} onClick={bloqUser}>Block User</Button>
                                                </div>
                                    }
                                </div>
                                {
                                    filterMessages?.length === 0 ? <p>Today</p>
                                        : filterMessages?.map((e) => {
                                            return (
                                                <div key={e._id} ref={scroll}>
                                                    <Message friendId={friendId._id} socket={socket} mensajes={[e]} currentUser={currentUser} currentChat={currentChat} actualDayMessages={actualDayMessages} filterGroupChat={filterGroupChat} />
                                                </div>)
                                        })
                                }
                            </div>
                            <form onSubmit={(e) => handleSubmit(e)} className={currentChat === '' ? s.divContactos : s.formMandarMensaje}>
                                <div className={s.divInputSend}>
                                    <Input size='sm' name="message" placeholder="Write a message" id={currentUser?._id} value={messages.textMessage} onChange={handleMessage} />
                                    <button type="submit" className={messages.textMessage === '' ? s.noneButton : s.sendMensaje}>Send</button>
                                </div>
                            </form>
                        </div>
                        <div className={profileChat ? s.divMensajes : s.displayNone}>
                            <div className={s.divCerrarInfo}>
                                <button onClick={handleCloseProfileChat} className={s.botonCerrarInfo}><GrClose /></button>
                                <span>{' '}{filterGroupChat.groupName ? 'Group info' : 'Contact info'}</span>
                            </div>
                            {
                                filterGroupChat.groupName ? <ProfileGroup filterGroupChat={filterGroupChat} currentChat={currentChat} currentUser={currentUser} />
                                    : <ChatProfile user={friendId} currentChat={currentChat} currentUser={currentUser} />
                            }
                        </div>
                    </div>
            }
        </div>)
}