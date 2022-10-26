import { useEffect } from "react"
import { Messages, User } from "../../../types"
import s from './Message.module.css'
interface Props {
    mensajes: Messages[]
    currentUser: User
    actualDayMessages: Messages[]
    pows: boolean
}

export default function Message({mensajes, currentUser, actualDayMessages,pows}: Props){
    
    const newDate = (e: string) => {
        const date = new Date(e)
        const hours = date.getHours()
        let minutes = date.getMinutes()
        if(minutes < 10) return (hours + ':0' + minutes)
        return (hours + ':' + minutes)
    }
    console.log("MENSAJES",mensajes)
    // useEffect(()=>{

    // },[pows])
    return(
        <div className={s.contenedorMensajes}>
            {
                mensajes.map((e) => {
                    return(<div>
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
                            <p className={s.textoMensajes}>{e.textMessage}</p>
                            <p className={s.textoMensajesHora}>{newDate(e.createdAt)}</p>
                        </div>
                    </div>)
            })}
        </div>)
}