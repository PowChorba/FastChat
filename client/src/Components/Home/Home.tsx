import { useAppDispatch, useAppSelector } from "../../Redux/hooks"
import { useEffect, useState} from 'react'
import { ALL_CHATS, ALL_USERS, USER_CHATS } from "../../Redux/actions/actions"
import { getAuth, signOut } from "firebase/auth"
import PrivateChat from "./PrivateChat/PrivateChat"
import s from './Home.module.css'
import { useNavigate } from "react-router-dom"
import Users from "./Users/Users"
import Contacts from "./Extras/Contacts"
import Chats from "./Chats/Chats"
import Profile from "./Profile/Profile"
import { Grid, GridItem, Text } from '@chakra-ui/react'
import { FiUsers } from 'react-icons/fi'
import { BsChatSquare } from 'react-icons/bs'
import { HiLogout } from 'react-icons/hi'

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
        dispatch(ALL_USERS())
        if(currentUser?._id){
            dispatch(USER_CHATS(currentUser._id))
            dispatch(ALL_CHATS())
        }
    }, [dispatch, currentUser?._id])
    
    console.log(currentUser)
    //SETTEAR VALOR DEL CURRENT CHAT
    const handleChat = (e: string ) => {
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
    <Grid templateColumns='1fr 3fr' className={s.contenedor}>
        <div className={s.divTitulo}>
            <Text fontSize='50px'>FastChat</Text>
        </div>
        <GridItem className={s.divAside}>
            {/* DEFAULT UI  */}
            <div className={!contacts || !usuarios || !profile ? s.none : s.asdasd}>
                <div className={s.perfilAside}>
                    <img src={currentUser?.image} alt="asd" width='48px' height='48px' className={s.imagenes} onClick={handleProfile}/>
                    <div>
                        <button onClick={handleContacts}><BsChatSquare className={s.iconos}/></button>
                        <button onClick={handleUsuarios}><FiUsers className={s.iconos}/></button>
                        <button onClick={() => logOut()}><HiLogout className={s.iconos}/></button>
                    </div>
                </div>
                    <input type="text" placeholder="Search chat.." value={searchChat} onChange={handleSearchChat} className={s.inputChats}/>
                <div className={s.divChatsDefault}>
                {   
                    filterUserChats.length !== 0 
                    ? filterUserChats && filterUserChats.map(e => {
                        return(
                            <div key={e._id} className={s.botonesChats}>
                                <button onClick={() => handleChat(e._id)} className={s.asd}><PrivateChat chatUser={e.chatsUsers} currentUser={currentUser}/></button>
                            </div>)
                    })
                    : userChats && userChats.map(e => {
                        return(
                            <div key={e._id} className={s.botonesChats}>
                                <button onClick={() => handleChat(e._id)} className={s.asd}><PrivateChat chatUser={e.chatsUsers} currentUser={currentUser}/></button>
                            </div>)
                    }) 
                }
                </div>
            </div> 
            {/* CONTACTS UI  */}
            <div className={contacts ? s.contactosHide : s.divContactos}>
                <div className={s.divProfile}>
                    <button onClick={handleContacts} className={s.botonAtras}>{'<'}</button>
                    <span>Contacts</span>
                </div>
                <Contacts currentUser={currentUser}/>
            </div>
            <div className={profile ? s.contactosHide : s.div}>
                <div className={s.divProfile}> 
                    <button onClick={handleProfile} className={s.botonAtras}>{'<'}</button>
                    <Text fontSize='20px'>Profile</Text>
                </div>
                <Profile currentUser={currentUser}/>
            </div>
            {/* USUARIOS UI  */}
            <div className={usuarios ? s.contactosHide : s.div}>
                <div className={s.divProfile}>
                    <button onClick={handleUsuarios} className={s.botonAtras}>{'<'}</button>
                    <Text>Users</Text>
                </div>
                <Users currentUser={currentUser}/>
            </div>
        </GridItem>
        <div>
            <Chats currentChat={currentChat} currentUser={currentUser} friendId={friendId}/>
        </div>
    </Grid>)
}