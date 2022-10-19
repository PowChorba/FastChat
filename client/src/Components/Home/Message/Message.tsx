import { Messages, User } from "../../../types"
import s from './Message.module.css'

interface Props {
    mensajes: Messages[]
    currentUser: User
}

export default function Message({mensajes, currentUser}: Props){
    
    const newDate = (e: string) => {
        const date = new Date(e)
        const hours = date.getHours()
        let minutes = date.getMinutes()
        if(minutes < 10) return (hours + ':0' + minutes)
        return (hours + ':' + minutes)
    }

    const day = (e: string) => {
        const date = new Date(e)
        const dia = date.getDay()
        return dia
    }

    const date = new Date()

    return(
        <div className={s.contenedorMensajes}>
            {
                mensajes.map((e) => {
                    return(<div>
                        {
                           date.getDay() - day(e.createdAt)  === 0 ? 'Today' : ''
                        }
                    </div>)
                })
            }
            {mensajes.map((e) => {
                return(
                    <div key={e._id} className={e.messageAuthor === currentUser?._id ? s.divRight : s.divLeft}>
                        <div className={e.messageAuthor === currentUser?._id ? s.divSubRight : s.divSubLeft}>
                            {/* <p className={s.textoMensajes}>{e.messageAuthor === currentUser?._id ? 'Tu' : friendId?.nickName }:</p> */}
                            <p className={s.textoMensajes}>{e.textMessage}</p>
                            <p className={s.textoMensajesHora}>{newDate(e.createdAt)}</p>
                        </div>
                    </div>)
            })}
        </div>)
}