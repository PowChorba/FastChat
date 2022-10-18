import { useAppSelector } from "../../../Redux/hooks"
import { Messages, User } from "../../../types"
import { RootState } from "../../../Redux/store"
import s from './Message.module.css'

interface Props {
    mensajes: Messages[]
    chat: string
    currentUser: User
}

export default function Message({mensajes, chat, currentUser}: Props){
    // let allChats = useAppSelector((state: RootState) => state.clientReducer.chats)
    // allChats = allChats?.filter(e => e._id === chat)
    // const friendId = allChats[0]?.chatsUsers.filter(e => e._id !== currentUser?._id)[0]
    
    const newDate = (e: string) => {
        const date = new Date(e)
        const hours = date.getHours()
        let minutes = date.getMinutes()
        if(minutes < 10) return (hours + ':0' + minutes)
        return (hours + ':' + minutes)
    }

    return(
        <div className={s.contenedorMensajes}>
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