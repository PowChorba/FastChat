import { Button, Input } from "@chakra-ui/react"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { BLOCK_USER, DELETE_CHAT, NEW_MESSAGE, USER_CONTACTS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { Chats, GetMessageData, Messages, SocketUser, GetMessageDeleted, User, CreateMessages } from "../../../types"
import ChatProfile from "../Extras/UserChatProfile"
import Message from "../Message/Message"
import s from './Chats.module.css'
import { GrClose } from 'react-icons/gr'
import ProfileGroup from "../Extras/ProfileGroup"
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineSearch, AiOutlineSend } from "react-icons/ai"
import Emojis from "./emojis/emojis"
import { BiHappyAlt } from 'react-icons/bi'
import { BsMicFill } from 'react-icons/bs'
import IconsMenu from "./menu/Menu"
import AudioRecorderTest from "./Audio/Audio"
import SearchMessages from "../Extras/SearchMessages"
import { date, fechaActual, sortMessagesChat } from "../Tools/Tools"
interface Props {
    currentUser: User
    currentChat: string
    friendId: User
    socket: any
    allChats: Chats[]
    setPendingMessages: Dispatch<SetStateAction<Messages[]>>
    pendingMessages: Messages[]
    setCurrentChat: React.Dispatch<React.SetStateAction<string>>
}

export default function Chatss({ setCurrentChat,currentUser, currentChat, friendId, socket, allChats, pendingMessages, setPendingMessages }: Props) {
    const [audioStatus, setAudioStatus] = useState(false)
    const [sendingAudio, setSendingAudio] = useState(false)
    const [pows, setPows] = useState(true)
    const [emoji, setEmoji] = useState(false)
    const [test, setTest] = useState<Messages[]>([])
    const [writting, setWritting] = useState(false)
    const [deleteMessage, setDeleteMessage] = useState<Messages>()
    const scroll = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const allMessages = useAppSelector(state => state.clientReducer.messages)
    let filterMessages = allMessages?.filter(e => e.chatId === currentChat)
    //PARA PODER RENDERIZAR BIEN LOS GRUPOS
    const filterGroupChat = allChats.filter(e => e._id === currentChat)[0]

    useEffect(() => {
        scroll.current?.scrollIntoView(false)
    })

    const [messageReceived, setMessageReceived] = useState({
        senderId: "",
        text: "",
        senderChat: "",
        id: ""
    })

    const [messages, setMessages] = useState<CreateMessages>({
        textMessage: '',
        messageAuthor: '',
        chatId: '',
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
            chatId: currentChat,
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (emoji) setEmoji(false)
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
            isGroup: filterGroupChat?.groupName,
            isImage: messages.isImage
        })
        let messageComplete = {
            textMessage: messages.textMessage,
            messageAuthor: messages.messageAuthor,
            chatId: messages.chatId,
            isImage: messages.isImage,
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
    const [searchMessages, setSearchMessages] = useState(false)

    const handleProfileChat = () => {
        setProfileChat(true)
        setSearchMessages(false)
    }

    const handleCloseProfileChat = () => {
        setProfileChat(false)
    }

    const handleSearchMessages = () => {
        setSearchMessages(true)
        setProfileChat(false)
    }

    const handleCloseSearchMessages = () => {
        setSearchMessages(false)
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
        setTest(()=>{
            // CADA VEZ QUE ABREN UN CHAT LIMPIA EL ESTADO CON MENSAJES NUEVOS
            let renewMsgState = pendingMessages.filter(msg=> msg.chatId === currentChat)
            return renewMsgState
        })
        let myPendingMsg = pendingMessages.filter(msg => msg.chatId === currentChat)

        setMessageReceived({
            id: myPendingMsg[myPendingMsg.length - 1]?._id,
            senderId: myPendingMsg[myPendingMsg.length - 1]?.messageAuthor,
            text: myPendingMsg[myPendingMsg.length - 1]?.textMessage,
            senderChat: myPendingMsg[myPendingMsg.length - 1]?.chatId
        })

        socket.current?.on('getMessage', (data: GetMessageData) => {
            if (data.senderChat === currentChat) {
                setMessageReceived({
                    id: data.messageId || uuidv4(),
                    senderId: data.senderId,
                    text: data.text,
                    senderChat: data.senderChat,
                })
                setTest((prevState) => {
                    let getSocketMessage = prevState.filter(msg => msg._id !== data.messageId)
                    getSocketMessage.push({
                        _id: data.messageId,
                        textMessage: data.text,
                        messageAuthor: data.senderId,
                        chatId: data.senderChat,
                        isImage: data.isImage,
                        createdAt: new Date().toISOString(),
                        isAudio: data.isAudio
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
            setPendingMessages((prevState) => {
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
                if (data.type === "text"){
                    if (data.text) setWritting(true)
                    else setWritting(false)
                } else if (data.type === "audio"){
                    if (data.text) setSendingAudio(true)
                    else setSendingAudio(false)
                }
            }
        })
    }, [messageReceived, currentChat, socket])
    
    const [online, setOnline] = useState<string[]>([])

    useEffect(() => {
        socket.current?.on('getUsers', (users: SocketUser[]) => {
            setOnline(users?.map((e) => e.userId))
        })
    }, [currentUser, socket])

    const actualDayMessages = filterMessages.filter(e => fechaActual(e.createdAt) === fechaActual(date.toString()))

    // BORRA O AGREGA MENSAJE 
    if (currentChat === messageReceived.senderChat || currentChat === deleteMessage?.chatId) {
        test.forEach((msgState) => {
            filterMessages = filterMessages.filter(ele => ele._id !== msgState._id && ele.chatId === currentChat)
        })
        filterMessages = [...filterMessages, ...test]
    }

    // ORDENA LOS MENSAJES POR FECHA
    filterMessages = sortMessagesChat(filterMessages)

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
    }
    return (
        <div>
            {
                currentChat === ''
                    ? <div className={s.divChatsCerrados}>
                        <h4>Open a conversation or start a new one!</h4>
                    </div>
                    :
                    <div className={profileChat || searchMessages ? s.contenedor : s.asd}>
                        <div className={s.divMensajes}>
                            <div className={s.divDatosUserChat}><img src={filterGroupChat?.img ? filterGroupChat?.img : friendId?.image} alt="asd" className={s.imagenes} />
                                <div className={s.contenedorPerfil} onClick={handleProfileChat}>
                                    <p>{filterGroupChat?.groupName ? filterGroupChat.groupName : friendId?.nickName}</p>
                                    <p className={s.conection}>
                                        {
                                            filterGroupChat?.groupName
                                            ? filterGroupChat.chatsUsers.map(e => {
                                                return(<span key={e._id}>{e.nickName}{' '}</span>)
                                            })
                                            : writting ? "Writting..." : sendingAudio ? "Sending audio..." : (online.filter(e => e === friendId?._id).length === 1 ? 'online' : 'offline')
                                        }
                                    </p>
                                </div>
                                <div><AiOutlineSearch onClick={handleSearchMessages}/></div>
                            </div>
                            <div className={s.contenedorMensajes}>
                                <div className={s.buttonsAddBloq}>
                                    {
                                        !filterGroupChat?.groupName && (prueba?.length !== 0 || !pows ? <span></span>
                                                : <div className={s.divAgregarBloquear}>
                                                    <p>If you know this user, press de <b>Add button</b>. If not, press the <b>Block button</b></p>
                                                    <Button variant='outline' colorScheme='green' onMouseEnter={() => handleDataNewContact(friendId?._id)} onClick={handleNewContact}>Add Contact</Button>{' '}
                                                    <Button variant='outline' colorScheme='red' onMouseEnter={() => handleBlockId(friendId?._id)} onClick={bloqUser}>Block User</Button>
                                                </div>
                                    )}
                                </div>
                                {
                                    filterMessages?.length === 0 ? <p>Today</p>
                                        : filterMessages?.map((e) => {
                                            return (
                                                <div key={e._id} ref={scroll}>
                                                    <Message friendId={friendId?._id} socket={socket} mensajes={[e]} currentUser={currentUser} currentChat={currentChat} actualDayMessages={actualDayMessages} filterGroupChat={filterGroupChat} />
                                                </div>)
                                        })
                                }
                                {emoji && <Emojis id={currentUser?._id} chat={currentChat}  setMessages={setMessages}/>}
                            </div>
                               <div className={s.divGridForm}>
                                    <div className={s.divImagenIconos}>
                                        <BiHappyAlt size="1.5em" onClick={()=>setEmoji(!emoji)}/>
                                        <IconsMenu currentChat={currentChat} currentUser={currentUser} setMessages={setMessages} messages={messages}/>
                                        <BsMicFill onClick={()=> setAudioStatus(!audioStatus)}/>
                                    </div>
                                    {
                                        audioStatus 
                                        ? <div className={s.formMandarMensaje}><AudioRecorderTest group={filterGroupChat.groupName} friend={friendId._id} chat={currentChat} userId={currentUser?._id} socket={socket} setAudioStatus={setAudioStatus}/></div>
                                        : <form onSubmit={(e) => handleSubmit(e)} className={currentChat === '' ? s.divContactos : s.formMandarMensaje}>
                                            <Input size='sm' name="message" placeholder="Write a message" id={currentUser?._id} value={messages.textMessage} onChange={handleMessage} />
                                            <button type="submit" className={messages.textMessage === '' ? s.noneButton : s.sendMensaje}><AiOutlineSend className={s.iconos}/></button>
                                        </form> 
                                    }
                               </div>
                        </div>
                        <div className={profileChat ? s.divMensajes : s.displayNone}>
                            <div className={s.divCerrarInfo}>
                                <button onClick={handleCloseProfileChat} className={s.botonCerrarInfo}><GrClose /></button>
                                <span>{' '}{filterGroupChat?.groupName ? 'Group info' : 'Contact info'}</span>
                            </div>
                            {
                                filterGroupChat?.groupName ? <ProfileGroup filterGroupChat={filterGroupChat} currentChat={currentChat} currentUser={currentUser} />
                                    : <ChatProfile setCurrentChat={setCurrentChat} setProfileChat = {setProfileChat} user={friendId} currentChat={currentChat} currentUser={currentUser}/>
                            }
                        </div>
                        <div className={searchMessages ? s.divMensajes : s.displayNone}>
                            <div className={s.divCerrarInfo}>
                                <button onClick={handleCloseSearchMessages} className={s.botonCerrarInfo}><GrClose /></button>
                                <span>{' '}Search Messages</span>
                            </div>
                            <SearchMessages filterMessages={filterMessages}/>
                        </div> 
                    </div>
            }
        </div>)
}