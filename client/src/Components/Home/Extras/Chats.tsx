import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { ALL_MESSAGES, NEW_MESSAGE } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { User } from "../../../types"
import Message from "../Message/Message"
import s from './Chats.module.css'

const socket = io("http://localhost:3001");

interface Props {
    currentUser: User
    currentChat: string
    friendId: User
}

export default function Chats({currentUser, currentChat, friendId}: Props) {
    const dispatch = useAppDispatch()
    const allMessages = useAppSelector(state => state.clientReducer.messages)
    const filterMessages = allMessages?.filter(e => e.chatId === currentChat)

    useEffect(() => {
        dispatch(ALL_MESSAGES())
    }, [dispatch])
    
    const [messages, setMessages] = useState({
        textMessage: '',
        messageAuthor: '',
        chatId: ''
    })

    const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessages({
            messageAuthor: e.target.id,
            textMessage: e.target.value,
            chatId: currentChat
        })
    }
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        socket.emit("message",messages)
        dispatch(NEW_MESSAGE(messages))
        setMessages({
            textMessage: '',
            messageAuthor: '',
            chatId: ''
        })
    }

    return(
        <div>
            {
            currentChat === '' 
            ? <div className={s.divChatsCerrados}>
                <h4>Open a conversation or start a new one!</h4>
            </div> 
            :
            <div className={s.divMensajes}>
            <div className={s.divDatosUserChat}><img src={friendId?.image} alt="asd"  width="48px" className={s.imagenes}/> {friendId?.nickName}</div>
        <div className={s.contenedorMensajes}>
            {
                filterMessages?.length === 0 ? <p>Today</p>
                : filterMessages?.map(e => {
                    return(
                        <div key={e._id}>
                            <Message mensajes={[e]} chat={currentChat} currentUser={currentUser}/>
                        </div>)
                })
            }
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className={currentChat === '' ? s.divContactos : s.formMandarMensaje}>
            <textarea name="message" placeholder="Write a message" id={currentUser?._id} value={messages.textMessage} onChange={handleMessage} cols={100} rows={2} className={s.formTextArea}></textarea>
            <button type="submit" className={messages.textMessage === '' ? s.noneButton : s.sendMensaje}>Send</button>
        </form>
        </div>
        }
        </div>)
}