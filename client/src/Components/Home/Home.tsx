import { useAppDispatch, useAppSelector } from "../../Redux/hooks"
import React, { useEffect, useState} from 'react'
import { ALL_CHATS, ALL_USERS, USER_CHATS } from "../../Redux/actions/actions"
import { getAuth, signOut } from "firebase/auth"
import PrivateChat from "./PrivateChat/PrivateChat"
import s from './Home.module.css'
import { useNavigate } from "react-router-dom"
import Users from "./Extras/Users"
import Contacts from "./Extras/Contacts"
import Chats from "./Extras/Chats"
import Profile from "./Extras/Profile"

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
    let userChats = useAppSelector(state => state.clientReducer.userChats)
    const currentUser = allUsers?.filter(e => e.userEmail === auth?.currentUser?.email)[0]
    //FILTER USER CHATS
    const [searchChat, setSearchChat] = useState('')
    
    const handleSearchChat = (e: React.ChangeEvent<HTMLInputElement>) =>{ 
        setSearchChat(e.target.value)
    }
    
    const filterUserChats = userChats.filter(e => e.chatsUsers[0].nickName === searchChat 
        || e.chatsUsers[1].nickName === searchChat 
        || e.chatsUsers[0].nickName.toLowerCase() === searchChat 
        || e.chatsUsers[1].nickName.toLowerCase() === searchChat 
        || e.chatsUsers[0].nickName.toUpperCase() === searchChat 
        || e.chatsUsers[1].nickName.toUpperCase() === searchChat)    

    //USE STATE
    const [currentChat, setCurrentChat] = useState('')
    //PARA LOS CHATS DEL USUARIO LOGEADO
    useEffect(() =>{
        if(currentUser?._id){
            dispatch(USER_CHATS(currentUser?._id))
        }
        dispatch(ALL_USERS())
        dispatch(ALL_CHATS())
    }, [dispatch, currentUser?._id])

    //SETTEAR VALOR DEL CURRENT CHAT
    const handleChat = (e: string | undefined) => {
        if(e) {
            setCurrentChat(e)
        }
    }

    //PERFIL DEL CONTACTO QUE TIENE EL CHAT ABIERTO
    let allChats = useAppSelector(state => state.clientReducer.chats)
    allChats = allChats?.filter(e => e._id === currentChat)
    const friendId = allChats[0]?.chatsUsers.filter(e => e._id !== currentUser?._id)[0]
    //PARA MOSTRASR LA INTERFAZ DE CONTACTOS O LA DE USUARIOS
    const [contacts, setContacts ] = useState(true)
    const [usuarios, setUsuarios] = useState(true)
    const [profile, setProfile] = useState(true)

    const handleContacts = () => {
        setContacts(!contacts)
    }

    const handleUsuarios = () => {
        setUsuarios(!usuarios)
    }

    const handleProfile = () => {
        setProfile(!profile)
    }

    return(
    <div className={s.contenedor}>
        <div className={s.divTitulo}>
            <h1>FastChat</h1>
        </div>
        <div className={s.divAside}>
            {/* DEFAULT UI  */}
            <div className={!contacts || !usuarios || !profile ? s.none : s.asdasd}>
                <div className={s.perfilAside}>
                    <img src={currentUser?.image} alt="asd" width='48px' height='48px' className={s.imagenes} onClick={handleProfile}/>
                    <div>
                        <button onClick={handleContacts}>Contacts</button>
                        <button onClick={handleUsuarios}>Users</button>
                        <button onClick={() => logOut()}>Log out</button>
                    </div>
                </div>
                <form>
                    <input type="text" placeholder="Search chat.." value={searchChat} onChange={handleSearchChat}/>
                </form>
                <div>
                {   
                    filterUserChats.length !== 0 
                    ? filterUserChats && filterUserChats.map(e => {
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
                <span>Contacts</span>
                <Contacts currentUser={currentUser}/>
            </div>
            <div className={profile ? s.contactosHide : s.divContactos}>
                <button onClick={handleProfile}>{'<'}</button>
                <span>Profile</span>
                <Profile currentUser={currentUser}/>
            </div>
            {/* USUARIOS UI  */}
            <div className={usuarios ? s.contactosHide : s.asd}>
                 <button onClick={handleUsuarios}>{'<'}</button>
                 <span>Users</span>
                <Users currentUser={currentUser}/>
            </div>
        </div>
        <div>
            <Chats currentChat={currentChat} currentUser={currentUser} friendId={friendId}/>
        </div>
    </div>)
}