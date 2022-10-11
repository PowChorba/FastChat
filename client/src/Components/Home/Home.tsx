import { useAppDispatch, useAppSelector } from "../../Redux/hooks"
import { useEffect, useState} from 'react'
import { ALL_CHATS, ALL_MESSAGES, ALL_USERS, NEW_CHAT, NEW_MESSAGE, USER_CHATS, USER_FILTER } from "../../Redux/actions/actions"
import { getAuth, signOut } from "firebase/auth"
import PrivateChat from "./PrivateChat"
import s from './Css/Home.module.css'
import Message from "./Message"
import { useNavigate } from "react-router-dom"

export default function Home(){
    const dispatch = useAppDispatch()
    const auth = getAuth()
    const navigate = useNavigate()

    //DESLOGEAR
    const logOut = () => {
        signOut(auth)
        navigate('/login')
    }
    //ESTADOS DEL REDUCER
    const allUsers = useAppSelector(state => state.clientReducer.users)
    const allMessages = useAppSelector(state => state.clientReducer.messages)
    const userChats = useAppSelector(state => state.clientReducer.userChats)
    const searchUser = useAppSelector(state => state.clientReducer.searchUser)
    const currentUser = allUsers?.filter(e => e.userEmail === auth?.currentUser?.email)[0]
    
    //USE STATE
    const [currentChat, setCurrentChat] = useState('')
    const [newChat, setNewChat] = useState({
        firstUser: '',
        secondUser: ''
    })
    
    //PARA LOS CHATS DEL USUARIO LOGEADO
    useEffect(() =>{
        if(currentUser?._id){
            dispatch(USER_CHATS(currentUser?._id))
        }
        dispatch(ALL_USERS())
    }, [dispatch, currentUser?._id])

    const handleDatosChat = (e: any) => {
        if(currentUser?._id !== undefined) {
            setNewChat({
                firstUser: currentUser._id,
                secondUser: e
            })
        }
    }

    const handleNewChat = () => {
        dispatch(NEW_CHAT(newChat))
    }

    //SETTEAR VALOR DEL CURRENT CHAT
    const handleChat = (e: any) => {
        setCurrentChat(e)
    }

    useEffect(() => {
        dispatch(ALL_MESSAGES())
        dispatch(ALL_CHATS())
    }, [dispatch])

    const filterMessages = allMessages?.filter(e => e.chatId === currentChat)
    //PARA CREAR UN NUEVO MENSAJE EN EL CHAT
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
        dispatch(NEW_MESSAGE(messages))
        setMessages({
            textMessage: '',
            messageAuthor: '',
            chatId: ''
        })
    }

    //PERFIL DEL CONTACTO QUE TIENE EL CHAT ABIERTO
    let allChats = useAppSelector(state => state.clientReducer.chats)
    allChats = allChats?.filter(e => e._id === currentChat)
    let friendId = allChats[0]?.chatsUsers.filter(e => e !== currentUser?._id)[0]
    const friend = allUsers?.filter(e => e._id === friendId)[0]

    //BUSQUEDA DE CONTACTOS
    const [busqueda, setBusqueda] = useState('')

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }

    const handleSubmitBusqueda = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(USER_FILTER(busqueda))
    }

    const [hide, setHide ] = useState(true)

    const handleHide = () => {
        setHide(!hide)
}

console.log(userChats)

return(
    <div className={s.contenedor}>
        <button onClick={handleHide} className={s.btnContactos}>{hide ? 'Show Contacts' : 'Hide Contacts'}</button>
        <button onClick={() => logOut()}>Deslogear</button>
        <div className={s.divTitulo}>
            <h1>Este es el chat</h1>
        </div>
        <div className={s.divBusquedaUsuarios}>
        <p>Aca los contactos</p>
        <form onSubmit={handleSubmitBusqueda}>
            <input type="text" name="busqueda" value={busqueda} onChange={handleBusqueda}/>
            <button type="submit">Buscar</button>
        </form>
        {
            // searchUser.length !== 0 && searchUser?.map(e => {
            //     return(
            //         <div key={e._id}>
            //             <p>{e.nickName}</p>
            //             <button onClick={() => handleNewContact(e._id)}>Add Contact</button>
            //         </div>)
            // })
            typeof (searchUser) === 'object' ?  searchUser?.map(e => {
                return(
                    <div key={e._id}>
                        <p>{e.nickName}</p>
                        <button>Add Contact</button>
                    </div>)
            }): <p>Usuario inexistente</p>
        }
        </div>
        <div className={hide ? s.contactosHide : s.divContactos}>
        {
            currentUser && currentUser.contacts?.length === 0 ? <p>No tienes contactos.</p>
            : currentUser?.contacts?.map(e => {
                return(
                    <div key={e._id}>
                        {/* <p>{e._id}</p> */}
                        <p>{e.userEmail}</p>
                        <p>{e.nickName}</p>
                        {
                           userChats.length !== 0 && userChats?.filter(e => e.chatsUsers[0] === e._id || e.chatsUsers[1] === e._id ) ? 'Ya tienen un chat creado'
                           : <button value={e._id} onMouseEnter={()=> handleDatosChat(e._id)} onClick={handleNewChat}>New Chat</button> 
                        }
                    </div>)
            })
        }
        </div>
        <div>
        <h2>All Chats</h2>
        {
            userChats && userChats.map(e => {
                return(
                    <div key={e._id}>
                        <button onClick={() => handleChat(e._id)}><PrivateChat chatUser={e.chatsUsers} currentUser={currentUser}/></button>
                    </div>)
            })
        }
        </div>
        <div className={s.divMensajes}>
            <div><img src={friend?.image} alt="asd"  width="48px"/> {friend?.nickName}</div>
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
        <form onSubmit={(e) => handleSubmit(e)} className={currentChat === '' ? s.divContactos : s.a}>
            <textarea name="message" placeholder="Write a message" id={currentUser?._id} value={messages.textMessage} onChange={handleMessage} cols={50} rows={5}></textarea>
            <button type="submit">Send</button>
        </form>
        </div>
    </div>)
}