import { Chats, Messages, User } from "../../../types"
import s from './Message.module.css'
import { BiBlock } from 'react-icons/bi'
import { IoIosArrowDown } from 'react-icons/io'
import { useState } from "react"
import DeleteMessage from "./Dialog"
import { newDate } from "../Tools/Tools"

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
    const idOfUsers = filterGroupChat?.chatsUsers?.map(e => e._id)
    const nameOfUsers = filterGroupChat?.chatsUsers?.map(e => e.nickName)
    const [dialog, setDialog] = useState(false)

    const handleDialog = () => {
        setDialog(!dialog)
    }
    const colorNames: any = (i:number)=>{
        let index = i
        if (i === 0) return "violet"
        else if (i === 1) return "orange"
        else if (i === 2) return "blue"
        else if (i === 3) return "green"
        else if (i === 4) return "yellow"
        else if (i === 5) return "grey"
        else if (i === 6) return "red"
        else {
            index = --index
             return colorNames(index)
        }
    }

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
            {mensajes.map((e,i) => {
                return(
                    <div key={e._id} className={e.messageAuthor === currentUser?._id ? s.divRight : s.divLeft}>
                        <div className={e.messageAuthor === currentUser?._id ? s.divSubRight : s.divSubLeft}>
                            {
                                e.isDeleted ? <p className={s.deletedMessage}><BiBlock/>{e.textMessage}</p>
                                : filterGroupChat?.groupName 
                                ?   <div>
                                        <p className={s[colorNames(idOfUsers.indexOf(e.messageAuthor))]}>{e.messageAuthor === currentUser?._id ? '' : nameOfUsers[idOfUsers.indexOf(e.messageAuthor)]}</p>
                                        {
                                            e.isImage ? <img src={e.textMessage} alt="Not Found" className={s.image}/> : e.isAudio ? <audio src={e.textMessage} controls className={s.audio}/> : <p className={s.textoMensajes}>{e.textMessage}</p> 
                                        }
                                    </div> 
                                : <div>
                                    {
                                            e.isImage ? <img src={e.textMessage} alt="Not Found" className={s.image}/> : e.isAudio ? 
                                            <audio src={e.textMessage} controls className={s.audio}/> :<p className={s.textoMensajes}>{e.textMessage}</p> 
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