import { useAppSelector } from "../../../Redux/hooks"
import { Messages, User } from "../../../types"
import { RootState } from "../../../Redux/store"
import s from './Message.module.css'

interface Props {
    mensajes: Messages[]
    chat: string
    currentUser: User | undefined
}

export default function Message({mensajes, chat, currentUser}: Props){
    let allChats = useAppSelector((state: RootState) => state.clientReducer.chats)
    allChats = allChats?.filter(e => e._id === chat)
    const friendId = allChats[0]?.chatsUsers.filter(e => e._id !== currentUser?._id)[0]
    
    return(
        <div className={s.contenedorMensajes}>
            {mensajes.map((e) => {
                return(
                    <div key={e._id} className={e.messageAuthor === currentUser?._id ? s.divRight : s.divLeft}>
                        <p>{e.messageAuthor === currentUser?._id ? 'Tu' : friendId?.nickName }</p>
                        <p>{e.textMessage}</p>
                        <p>{e.createdAt}</p>
                    </div>)
            })}
        </div>)
}