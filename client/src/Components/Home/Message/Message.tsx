import { Chats, Messages, User } from "../../../types"
import s from './Message.module.css'
import { BiBlock } from 'react-icons/bi'
import { IoIosArrowDown } from 'react-icons/io'
import { useState } from "react"
import DeleteMessage from "./Dialog"

interface Props {
    mensajes: Messages[]
    currentUser: User
    actualDayMessages: Messages[]
    filterGroupChat: Chats
    socket: any
    currentChat: string
    friendId: string
}

export default function Message({mensajes, currentUser, actualDayMessages, socket, currentChat, friendId, filterGroupChat}: Props){
    
    //PARA PODER AGREGAR EL NOMBRE ARRIBA DEL MENSAJE CUANDO NO ES DEL USUARIO LOGEADO
    const idOfUsers = filterGroupChat.chatsUsers.map(e => e._id)
    const nameOfUsers = filterGroupChat.chatsUsers.map(e => e.nickName)
    const [dialog, setDialog] = useState(false)

    const handleDialog = () => {
        setDialog(!dialog)
    }


    const newDate = (e: string) => {
        const date = new Date(e)
        const hours = date.getHours()
        let minutes = date.getMinutes()
        if(minutes < 10) return (hours + ':0' + minutes)
        return (hours + ':' + minutes)
    }

    // console.log(mensajes, 'images')

    return(
        <div className={s.contenedorMensajes}>
            {
                mensajes.map((e) => {
                    return(<div key={e._id}>
                        {
                           actualDayMessages[0] === e ? <div className={s.today}><p>Today</p></div> : ''
                        }
                    </div>)
                })

            }
            {mensajes.map((e) => {
                return(
                    <div key={e._id} className={e.messageAuthor === currentUser?._id ? s.divRight : s.divLeft}>
                        <div className={e.messageAuthor === currentUser?._id ? s.divSubRight : s.divSubLeft}>
                            {
                                e.isDeleted ? <p className={s.deletedMessage}><BiBlock/>{e.textMessage}</p>
                                : filterGroupChat?.groupName 
                                ?   <div>
                                        <p>{e.messageAuthor === currentUser?._id ? '' : nameOfUsers[idOfUsers.indexOf(e.messageAuthor)]}</p>
                                        {
                                            e.textMessage.length > 20 ? <img src={e.textMessage} alt="asd" /> : <p className={s.textoMensajes}>{e.textMessage}</p> 
                                        }
                                    </div> 
                                : <div>
                                    {
                                            e.isImage ? <img src={e.textMessage} alt="asd" /> : <p className={s.textoMensajes}>{e.textMessage}</p> 
                                    }
                                </div>
                            }
                            <p className={s.textoMensajesHora}>{newDate(e.createdAt)}</p>
                            {
                                e.messageAuthor === currentUser?._id ? <button className={s.arrowDown} onClick={handleDialog}><span><IoIosArrowDown/></span></button> : <span></span>
                            }
                            {
                                dialog ? <DeleteMessage createdAt={e.createdAt} friendId={friendId} currentChat={currentChat} currentUser={currentUser._id} socket={socket} setDialog={setDialog} messageId={e._id}/> : ''
                            }
                        </div>
                    </div>)
            })}
        </div>)
}