import { useAppSelector } from "../../Redux/hooks"
import { Messages, User } from "../../types"
import { RootState } from "../../Redux/store"
import s from './Css/Message.module.css'

interface Props {
    mensajes: Messages[]
    chat: string
    currentUser: User | undefined
}

export default function Message({mensajes, chat, currentUser}: Props){
    const allUsers = useAppSelector((state: RootState) => state.clientReducer.users)
    let allChats = useAppSelector((state: RootState) => state.clientReducer.chats)
    allChats = allChats?.filter(e => e._id === chat)
    let friendId = allChats[0]?.chatsUsers.filter(e => e !== currentUser?._id)[0]
    const friend = allUsers?.filter(e => e._id === friendId)[0]
    
    return(
        <div className={s.contenedorMensajes}>
            {mensajes.map((e: any) => {
                return(
                    <div key={e._id} className={e.messageAuthor === currentUser?._id ? s.divRight : s.divLeft}>
                        <p>{e.messageAuthor === currentUser?._id ? currentUser?.nickName : friend?.nickName }</p>
                        <p>{e.textMessage}</p>
                        <p>{e.createdAt}</p>
                    </div>)
            })}
        </div>)
}