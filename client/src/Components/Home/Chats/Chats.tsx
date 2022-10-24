import { Button, Input } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { NEW_MESSAGE, USER_CONTACTS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { SocketUser, User } from "../../../types"
import ChatProfile from "../Extras/UserChatProfile"
import Message from "../Message/Message"
import {io} from 'socket.io-client'
import s from './Chats.module.css'
import { GrClose } from 'react-icons/gr'

interface Props {
    currentUser: User
    currentChat: string
    friendId: User
}

export default function Chats({currentUser, currentChat, friendId}: Props) {
    const dispatch = useAppDispatch()
    const allMessages = useAppSelector(state => state.clientReducer.messages)
    const filterMessages = allMessages?.filter(e => e.chatId === currentChat)
    const socket: any = useRef()
    
    const [messages, setMessages] = useState({
        textMessage: '',
        messageAuthor: '',
        chatId: ''
    })

    // const [arrivalMessage, setArrivalMessage] = useState({
    //     sender: '',
    //     text: '',
    //     createdAt: ''
    // })

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
            text: messages.textMessage
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
        if(currentUser?._id){
            setContactData({
                userId: currentUser._id,
                contact: e
            })
        }
    }

    const handleNewContact = () => {
        dispatch(USER_CONTACTS(contactData))
    }
    
    const [online, setOnline ] = useState<string[]>([])

    useEffect(() => {
        socket.current?.emit('addUser', currentUser?._id)
        socket.current?.on('getUsers', (users: SocketUser[]) => {
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

    return(
        <div>
            {
            currentChat === '' 
            ? <div className={s.divChatsCerrados}>
                <h4>Open a conversation or start a new one!</h4>
            </div> 
            :
            <div className={profileChat ? s.contenedor : s.asd}>
            <div className={s.divMensajes}>
                <div className={s.divDatosUserChat } onClick={handleProfileChat}><img src={friendId?.image} alt="asd" className={s.imagenes}/> 
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
                        : filterMessages?.map((e) => { 
                            return(
                                <div key={e._id}>
                                    <Message mensajes={[e]} currentUser={currentUser} actualDayMessages={actualDayMessages}/>
                                </div>)
                        })
                    }
                </div>
                <form onSubmit={(e) => handleSubmit(e)} className={currentChat === '' ? s.divContactos : s.formMandarMensaje}>
                    <div className={s.divInputSend}>
                        <Input size='sm' name="message" placeholder="Write a message" id={currentUser?._id} value={messages.textMessage} onChange={handleMessage}/>
                        <button type="submit" className={messages.textMessage === '' ? s.noneButton : s.sendMensaje}>Send</button>
                    </div>
                </form>
                </div>
            <div className={profileChat ? s.divMensajes : s.displayNone}>
                <div className={s.divCerrarInfo}>
                    <button onClick={handleProfileChat} className={s.botonCerrarInfo}><GrClose/></button>
                    <span>{' '}Contact info</span>
                </div>
                <ChatProfile user={friendId} currentChat={currentChat} currentUser={currentUser}/>
            </div>
        </div>
        }
        </div>)
}