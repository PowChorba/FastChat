import { useAppDispatch, useAppSelector } from "../../Redux/hooks"
import { useEffect, useRef, useState} from 'react'
import { ALL_CHATS, ALL_USERS, USER_CHATS } from "../../Redux/actions/actions"
import { getAuth, signOut } from "firebase/auth"
import PrivateChat from "./PrivateChat/PrivateChat"
import s from './Home.module.css'
import { useNavigate } from "react-router-dom"
import Users from "./Users/Users"
import Contacts from "./Contacts/Contacts"
import Profile from "./Profile/Profile"
import { Grid, GridItem, Input, Text } from '@chakra-ui/react'
import { FiUsers } from 'react-icons/fi'
import { BsChatSquare } from 'react-icons/bs'
import { HiLogout } from 'react-icons/hi'
import { GrGroup } from 'react-icons/gr'
import BlockUsers from "./BlockUsers/BlockUsers"
import { TbUserOff } from 'react-icons/tb'
import { io } from "socket.io-client"
import ChatGroups from "./ChatGroups/ChatGroups"
import Chatss from "./Chats/Chats"
import { Messages } from "../../types"

export default function Home(){
    const dispatch = useAppDispatch()
    const auth = getAuth()
    const navigate = useNavigate()
    const socket: any = useRef()
    //DESLOGEAR
    const logOut = () => {
        signOut(auth)
        navigate('/')
    }
    //ESTADOS DEL REDUCER
    const allUsers = useAppSelector(state => state.clientReducer.users)
    const userChats = useAppSelector(state => state.clientReducer.userChats)
    const currentUser = allUsers?.filter(e => e.userEmail === auth?.currentUser?.email)[0]
    //FILTER USER CHATS
    const [searchChat, setSearchChat] = useState('')
    
    const handleSearchChat = (e: React.ChangeEvent<HTMLInputElement>) =>{ 
        setSearchChat(e.target.value)
    }

    const filterUserChats = userChats.filter(e => e.chatsUsers[0]?.nickName === searchChat 
        || e.chatsUsers[1]?.nickName === searchChat 
        || e.chatsUsers[0]?.nickName.toLowerCase() === searchChat 
        || e.chatsUsers[1]?.nickName.toLowerCase() === searchChat 
        || e.chatsUsers[0]?.nickName.toUpperCase() === searchChat 
        || e.chatsUsers[1]?.nickName.toUpperCase() === searchChat
        || e.groupName === searchChat
        || e.groupName?.toLowerCase() === searchChat
        || e.groupName?.toUpperCase() === searchChat 
        )    

    //USE STATE
    const [currentChat, setCurrentChat] = useState('')
    const [pendingMessages, setPendingMessages] = useState<Messages[]>([])
    //PARA LOS CHATS DEL USUARIO LOGEADO
    useEffect(() =>{
        dispatch(ALL_USERS())
        socket.current = io('ws://localhost:3002')
        if(currentUser?._id){
            dispatch(USER_CHATS(currentUser._id))
            dispatch(ALL_CHATS())
            socket.current?.emit('addUser', currentUser?._id)
        }
    }, [dispatch, currentUser?._id])
    
    //SETTEAR VALOR DEL CURRENT CHAT
    const handleChat = (e: string ) => {
        if(e) {
            setCurrentChat(e)
        }
    }
    
    //PERFIL DEL CONTACTO QUE TIENE EL CHAT ABIERTO
    let allChats = useAppSelector(state => state.clientReducer.chats)
    allChats = allChats?.filter(e => e._id === currentChat)
    const friendId = allChats[0]?.chatsUsers?.filter(e => e._id !== currentUser?._id)[0]
    //PARA MOSTRASR LA INTERFAZ DE CONTACTOS O LA DE USUARIOS
    const [contacts, setContacts ] = useState(true)
    const [usuarios, setUsuarios] = useState(true)
    const [profile, setProfile] = useState(true)
    const [block, setBlock] = useState(true)
    const [createGroup, setCreateGroup] = useState(true)

    const handleContacts = () => {
        setContacts(!contacts)
    }

    const handleUsuarios = () => {
        setUsuarios(!usuarios)
    }

    const handleProfile = () => {
        setProfile(!profile)
    }

    const handleBlock = () => {
        setBlock(!block)
    }

    const handleGroups = () => {
        setCreateGroup(!createGroup)
    }


    return(
    <Grid templateColumns='1fr 3fr' className={s.contenedor}>
        <GridItem className={s.divAside}>
            {/* DEFAULT UI  */}
            <div className={!contacts || !usuarios || !profile || !block || !createGroup ? s.none : s.asdasd}>
                <div className={s.perfilAside}>
                    <img src={currentUser?.image} alt="asd" width='48px' className={s.imagenPerfil} onClick={handleProfile}/>
                    <div>
                        <button onClick={handleContacts}><BsChatSquare className={s.iconos}/></button>
                        <button onClick={handleGroups}><GrGroup className={s.iconos}/></button>
                        <button onClick={handleBlock}><TbUserOff className={s.iconos}/></button>
                        <button onClick={handleUsuarios}><FiUsers className={s.iconos}/></button>
                        <button onClick={() => logOut()}><HiLogout className={s.iconos}/></button>
                    </div>
                </div>
                    <div className={s.inputChats}>
                        <Input variant='filled' type="text" placeholder="Search chat.." value={searchChat} onChange={handleSearchChat} />
                    </div>
                <div className={s.divChatsDefault}>
                {   
                    filterUserChats.length !== 0 
                    ? filterUserChats && filterUserChats?.map(e => {
                        return(
                            <div key={e._id} className={s.botonesChats}>
                                <button onClick={() => handleChat(e._id)} className={s.abrirChat}><PrivateChat setPendingMessages={setPendingMessages} allChatData={e} chatUser={e.chatsUsers} currentUser={currentUser} socket={socket}/></button>
                            </div>)
                    })
                    : userChats && userChats?.map(e => {
                        return(
                            <div key={e._id} className={s.botonesChats}>
                                <button onClick={() => handleChat(e._id)} className={s.abrirChat}><PrivateChat setPendingMessages={setPendingMessages} allChatData={e} chatUser={e.chatsUsers} currentUser={currentUser} socket={socket}/></button>
                            </div>
                            )
                    }) 
                }
                </div>
                <div className={s.textoCreadores}>
                    <p>Created by Iñaki Elhaiek & Agop Chorbadjian</p>
                </div>
            </div> 
            {/* CONTACTS UI  */}
            <div className={contacts ? s.contactosHide : s.divContactos}>
                <div className={s.divProfile}>
                    <button onClick={handleContacts} className={s.botonAtras}>{'<'}</button>
                    <Text fontSize='20px'>Contacts</Text>
                </div>
                <Contacts currentUser={currentUser} />
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
                    <Text fontSize='20px'>Users</Text>
                </div>
                <Users currentUser={currentUser}/>
            </div>
            {/* {BLOCK USERS} */}
            <div className={block ? s.contactosHide : s.div}>
                <div className={s.divProfile}> 
                    <button onClick={handleBlock} className={s.botonAtras}>{'<'}</button>
                    <Text fontSize='20px'>Block Users</Text>
                </div>
                <BlockUsers currentUser={currentUser}/>
            </div>
            {/* CREATE GROUP */}
            <div className={createGroup ? s.contactosHide : s.div}>
                <div className={s.divProfile}> 
                    <button onClick={handleGroups} className={s.botonAtras}>{'<'}</button>
                    <Text fontSize='20px'>Create Group</Text>
                </div>
                <ChatGroups currentUser={currentUser}/>
            </div>
        </GridItem>
        <div>
            <Chatss pendingMessages={pendingMessages} setPendingMessages={setPendingMessages} currentChat={currentChat} currentUser={currentUser} friendId={friendId} socket={socket} allChats={allChats}/>
        </div>
    </Grid>)
}