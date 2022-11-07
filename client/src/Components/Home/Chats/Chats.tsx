import { Button, Input } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
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
}

export default function Chatss({ currentUser, currentChat, friendId, socket, allChats }: Props) {
    const [pows, setPows] = useState(true)
    const [test, setTest] = useState<Messages[]>([])
    const [writting, setWritting] = useState(false)
    const [deleteMessage, setDeleteMessage] = useState<Messages>()
    // const [visible, setVisible] = useState(false)
    const dispatch = useAppDispatch()
    const allMessages = useAppSelector(state => state.clientReducer.messages)
    let filterMessages = allMessages?.filter(e => e.chatId === currentChat)
    //PARA PODER RENDERIZAR BIEN LOS GRUPOS
    const filterGroupChat = allChats.filter(e => e._id === currentChat)[0]

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
            messageId: id
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
        socket.current?.on('getMessage', (data: GetMessageData) => {
            setMessageReceived({
                id: data.messageId || uuidv4(),
                senderId: data.senderId,
                text: data.text,
                senderChat: data.senderChat
            })
            setTest((prev: Messages[]) => [...prev, {
                _id: data.messageId || uuidv4(),
                textMessage: data.text,
                messageAuthor: data.senderChat,
                chatId: currentChat,
                createdAt: new Date().toISOString(),
            }])
        })
        socket.current?.on("getDeleteMessage", (data: GetMessageDeleted) => {
            console.log("deleteMessage")
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
        // socket.current?.on("getDeleteMessage", (data: GetMessageDeleted) => {
        //     if (data.senderChat === currentChat) {
        //         setDeleteMessage({
        //             _id: data.messageId,
        //             textMessage: "Message Deleted",
        //             messageAuthor: data.senderId,
        //             chatId: data.senderChat,
        //             createdAt: data.createdAt,
        //             isDeleted: true
        //         })
        //     }
        //     setTest((prevState) => {
        //         let deleteSocketMessage = prevState.filter(msg => msg._id !== data.messageId)
        //         deleteSocketMessage.push({
        //             _id: data.messageId,
        //             textMessage: "Message Deleted",
        //             messageAuthor: data.senderId,
        //             chatId: data.senderChat,
        //             createdAt: data.createdAt,
        //             isDeleted: true
        //         })
        //         return deleteSocketMessage
        //     })
        // })
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
    // (messageReceived.text !== "" || deleteMessage?.isDeleted) &&
    if ( currentChat === messageReceived.senderChat || currentChat === deleteMessage?.chatId) {
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
    console.log(test)
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
                                                <div key={e._id}>
                                                    <Message friendId={friendId._id} socket={socket} mensajes={[e]} currentUser={currentUser} currentChat={currentChat} actualDayMessages={actualDayMessages} filterGroupChat={filterGroupChat}/>
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
                                filterGroupChat.groupName ? <ProfileGroup filterGroupChat={filterGroupChat} currentChat={currentChat} currentUser={currentUser}/>
                                : <ChatProfile user={friendId} currentChat={currentChat} currentUser={currentUser} />
                            }
                        </div>
                    </div>
            }
        </div>)
}