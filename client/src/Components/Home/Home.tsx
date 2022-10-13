import { useAppDispatch, useAppSelector } from "../../Redux/hooks"
import React, { useEffect, useState} from 'react'
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
    let userChats = useAppSelector(state => state.clientReducer.userChats)
    const searchUser = useAppSelector(state => state.clientReducer.searchUser)
    const currentUser = allUsers?.filter(e => e.userEmail === auth?.currentUser?.email)[0]
    //FILTER USER CHATS
    const [searchChat, setSearchChat] = useState('')
    
    const handleSearchChat = (e: React.ChangeEvent<HTMLInputElement>) =>{ 
        setSearchChat(e.target.value)
    }
    
    const filterUserChats = userChats.filter(e => e.chatsUsers[0].nickName === searchChat || e.chatsUsers[1].nickName === searchChat)    

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
    const friendId = allChats[0]?.chatsUsers.filter(e => e._id !== currentUser?._id)[0]

    //BUSQUEDA DE CONTACTOS
    const [busqueda, setBusqueda] = useState('')

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }

    const handleSubmitBusqueda = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(USER_FILTER(busqueda))
    }

    const [contacts, setContacts ] = useState(true)
    const [usuarios, setUsuarios] = useState(true)

    const handleContacts = () => {
        setContacts(!contacts)
    }

    const handleUsuarios = () => {
        setUsuarios(!usuarios)
    }

    return(
    <div className={s.contenedor}>
        <button onClick={() => logOut()}>Log out</button>
        <div className={s.divTitulo}>
            <h1>FastChat</h1>
        </div>
        <div className={s.divAside}>
            {/* DEFAULT UI  */}
            <div className={!contacts || !usuarios ? s.none : s.asdasd}>
                <div className={s.perfilAside}>
                    <img src={currentUser?.image} alt="asd" width='48px' height='48px' className={s.imagenes}/>
                    <div>
                        <button onClick={handleContacts}>Contacts</button>
                        <button onClick={handleUsuarios}>Users</button>
                    </div>
                </div>
                <form>
                    <input type="text" placeholder="Search chat.." value={searchChat} onChange={handleSearchChat}/>
                </form>
                <div>
                {   
                    filterUserChats.length !== 0 
                    ? filterUserChats.map(e => {
                        return(
                            <div key={e._id}>
                                <button onClick={() => handleChat(e._id)} className={s.asd}><PrivateChat chatUser={e.chatsUsers} currentUser={currentUser}/></button>
                            </div>)
                    })
                    : userChats && userChats.map(e => {
                        return(
                            <div key={e._id}>
                                <button onClick={() => handleChat(e._id)} className={s.asd}><PrivateChat chatUser={e.chatsUsers} currentUser={currentUser}/></button>
                            </div>)
                    }) 
                }
                </div>
            </div>
            {/* CONTACTS UI  */}
            <div className={contacts ? s.contactosHide : s.divContactos}>
                <button onClick={handleContacts}>{'<'}</button>
                <form>
                    <input type="text" placeholder="Seach contacts" />
                </form>
                {
                    currentUser && currentUser.contacts?.length === 0 ? <p>No tienes contactos.</p>
                    : currentUser?.contacts?.map(e => {
                        return(
                            <div key={e._id}>
                                <button value={e._id} onMouseEnter={()=> handleDatosChat(e._id)} onClick={handleNewChat}>
                                <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                                <span>{e.nickName}</span>
                                <br />
                                </button>
                            </div>)
                    })
                }
            </div>
            {/* USUARIOS UI  */}
            <div className={usuarios ? s.none : s.asd}>
                <button onClick={handleUsuarios}>{'<'}</button>
            <form onSubmit={handleSubmitBusqueda} className={s.formBusqueda}>
                <input type="text" name="busqueda" value={busqueda} onChange={handleBusqueda} placeholder='Search user...'/>
                <button type="submit" className={busqueda === '' ? s.noneButton : s.sendMensaje}>Search</button>
            </form>
                {
                    searchUser.length === 0 ? allUsers.map(e => {
                        return(<div key={e._id}>
                            <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                            <span>{e.nickName}</span>
                            <button className={s.sendMensaje}>Add Contact</button>
                            </div>)
                    })
                    : typeof (searchUser) === 'object' ?  searchUser?.map(e => {
                        return(
                            <div key={e._id}>
                                <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                                <span>{e.nickName}</span>
                                <button className={s.sendMensaje}>Add Contact</button>
                            </div>)
                    }): <p>We could not find that User</p>
                }
            </div>
        </div>
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