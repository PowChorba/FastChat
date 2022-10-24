import { Button, Input } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { NEW_MESSAGE, USER_CONTACTS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { GetMessageData, SocketUser, User } from "../../../types"
import ChatProfile from "../Extras/UserChatProfile"
import Message from "../Message/Message"
import { io } from 'socket.io-client'
import s from './Chats.module.css'
import { GrClose } from 'react-icons/gr'
import { async } from "@firebase/util"
import axios from "axios"
import { current } from "@reduxjs/toolkit"

interface Props {
    currentUser: User
    currentChat: string
    friendId: User
}

export default function Chats({ currentUser, currentChat, friendId }: Props) {
    const [pows, setPows] = useState<any>(true)
    const dispatch = useAppDispatch()
    const allMessages = useAppSelector(state => state.clientReducer.messages)
    let filterMessages = allMessages?.filter(e => e.chatId === currentChat)
    const socket: any = useRef()
    const [messageReceived, setMessageReceived] = useState({
        senderId: "",
        text: "",
        senderChat: ""
        // createdAt: ""
    })

    const [allMessagesArray, setAllMessagesArray] = useState<any>([...filterMessages])
    // console.log("fileter", filterMessages)
    // console.log("allmessa", allMessagesArray)

    const [messages, setMessages] = useState({
        textMessage: '',
        messageAuthor: '',
        chatId: ''
    })

    const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        setMessages({
            messageAuthor: e.target.id,
            textMessage: e.target.value,
            chatId: currentChat
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        socket.current.emit('sendMessage', {
            senderId: currentUser?._id,
            receiverId: friendId?._id,
            text: messages.textMessage,
            senderChat: currentChat
        })

        dispatch(NEW_MESSAGE(messages))
        setMessages({
            textMessage: '',
            messageAuthor: '',
            chatId: ''
        })
    }

    const [profileChat, setProfileChat] = useState(false)

    const handleProfileChat = () => {
        setProfileChat(!profileChat)
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
    }
    // useEffect(() => {
    //     let prueba = async () => {
    //         try {
    //             let pow = await axios.get("http://localhost:3001/chats/" + currentUser?._id)
    //              pow = pow.data?.filter((e:any) => e.chatId === currentChat)
    //             setPows(pow.data)
    //             console.log(pow.data, "res")
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }
    //     prueba()
    // }, [currentUser])
    // console.log(pows)

    useEffect(() => {
        socket.current = io('ws://localhost:3002')
        socket.current?.on('getMessage', (data: GetMessageData) => {
            console.log("dataFlaco", data)
            setMessageReceived({
                senderId: data.senderId,
                text: data.text,
                senderChat: data.senderChat
            })
        })
    }, [])
    console.log("MESSAGE RECEIVED", messageReceived)

    useEffect(() => {
        filterMessages.push({
            _id: "5",
            textMessage: messageReceived.text,
            messageAuthor: messageReceived.senderId,
            chatId: currentChat,
            createdAt: fechaActual(new Date().toString()),
        })
        setPows(!pows)
        console.log("estoy aca", filterMessages)
    }, [messageReceived, currentChat])

    const [online, setOnline] = useState<string[]>([])

    useEffect(() => {
        socket.current?.emit('addUser', currentUser?._id)
        socket.current?.on('getUsers', (users: SocketUser[]) => {
            // console.log(users)
            setOnline(users?.map((e) => e.userId))
        })
    }, [currentUser])

    //ARRAY PARA

    const fechaActual = (e: string) => {
        const date = new Date(e)
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }

    const date = new Date()

    const actualDayMessages = filterMessages.filter(e => fechaActual(e.createdAt) === fechaActual(date.toString()))
    console.log("MEnsaje final", messageReceived)
    console.log(filterMessages[filterMessages.length - 1], "ULTIMO FILTER")
    if(messageReceived.text !== "" && currentChat === messageReceived.senderChat ){
        filterMessages.push({
            _id: "5",
            textMessage: messageReceived.text,
            messageAuthor: messageReceived.senderId,
            chatId: currentChat,
            createdAt: fechaActual(new Date().toString()),
        })
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
                            <div className={s.divDatosUserChat} onClick={handleProfileChat}><img src={friendId?.image} alt="asd" className={s.imagenes} />
                                <div>
                                    <p>{friendId?.nickName}</p>
                                    <p className={s.conection}>
                                        {
                                            online.filter(e => e === friendId._id).length === 1 ? 'online' : 'offline'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className={s.contenedorMensajes}>
                                <div className={s.buttonsAddBloq}>
                                    {
                                        prueba?.length !== 0 ? <span></span>
                                            : <div className={s.divAgregarBloquear}>
                                                <p>If you know this user, press de <b>Add button</b>. If not, press the <b>Block button</b></p>
                                                <Button variant='outline' colorScheme='green' onMouseEnter={() => handleDataNewContact(friendId?._id)} onClick={handleNewContact}>Add Contact</Button>{' '}
                                                <Button variant='outline' colorScheme='red'>Block User</Button>
                                            </div>
                                    }
                                </div>
                                {
                                    filterMessages?.length === 0 ? <p>Today</p>
                                        : filterMessages?.map((e: any) => {
                                            return (
                                                <div key={e._id}>
                                                    <Message pows={pows} mensajes={[e]} currentUser={currentUser} actualDayMessages={actualDayMessages} />
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
                                <button onClick={handleProfileChat} className={s.botonCerrarInfo}><GrClose /></button>
                                <span>{' '}Contact info</span>
                            </div>
                            <ChatProfile user={friendId} currentChat={currentChat} currentUser={currentUser} />
                        </div>
                    </div>
            }
        </div>)
}