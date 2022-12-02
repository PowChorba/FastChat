import { filter, Input, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { useState } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { BLOCK_USER, DELETE_CONTACT, NEW_CHAT } from "../../../Redux/actions/actions"
import { useAppDispatch } from "../../../Redux/hooks"
import { User } from "../../../types"
import s from './Contacts.module.css'

interface Props {
    currentUser: User
}


export default function Contacts({currentUser}: Props) {
    const dispatch = useAppDispatch()
    const filterBloqUsers = currentUser?.bloqUsers.map(e => e._id)
    const filterContactsUsers = currentUser?.contacts?.filter(e => !filterBloqUsers.includes(e._id))
    const [newChat, setNewChat] = useState({
        firstUser: '',
        secondUser: ''
    })
    const [busqueda, setBusqueda] = useState('')

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }

    const busquedaContacts = currentUser?.contacts?.filter(e => e.nickName.includes(busqueda)
        || e.nickName.toLowerCase().includes(busqueda)
        || e.nickName.toUpperCase().includes(busqueda))

    const handleDatosChat = (e: string | undefined) => {
        if(currentUser?._id !== undefined && e) {
            setNewChat({
                firstUser: currentUser._id,
                secondUser: e
            })
        }
    }
    
    const handleNewChat = () => {
        dispatch(NEW_CHAT(newChat))
    }

    //PARA BORRAR CONTACTO
    const [deleteData, setDeleteContacts] = useState({
        userId: '',
        contactId: ''
    })

    const loadData = (e: string) => {
        setDeleteContacts({
            userId: currentUser?._id,
            contactId: e
        })
    }

    const deleteContact = async () => {
        dispatch(DELETE_CONTACT(deleteData))
    }

        //BLOQUEAR Usuario
        const [block, setBlock] = useState({
            userId: '',
            bloqUserId: ''
        })
    
        const handleBlockId = (e: string) => {
            if (currentUser?._id) {
                setBlock({
                    userId: currentUser._id,
                    bloqUserId: e
                })
                setDeleteContacts({
                    userId: currentUser?._id,
                    contactId: e
                })
            }
        }
    
        const bloqUser = () => {
            dispatch(BLOCK_USER(block))
            dispatch(DELETE_CONTACT(deleteData))
        }

    return(
        <div className={s.contenedor}>
                <div className={s.formInput}>
                    <Input variant='filled' type="text" placeholder="Seach contacts" value={busqueda} onChange={handleBusqueda}/>
                </div>
                <div className={s.divContactsMap}>
                {
                    currentUser && currentUser.contacts?.length === 0 ? <p className={s.noContacts}>No contacts added</p>
                    : busquedaContacts?.length !== 0 
                    ? busquedaContacts?.map(e => {
                        return(
                            <div key={e._id} className={s.profileUsers}>
                                <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                                <span>{e.nickName}</span>
                                <div className={s.arrowDown}>
                                    <Menu>
                                        <MenuButton><IoIosArrowDown/></MenuButton>
                                        <MenuList>
                                            <MenuItem onMouseEnter={()=> handleDatosChat(e._id)} onClick={handleNewChat}>New chat</MenuItem>
                                            <MenuItem onMouseEnter={()=> loadData(e._id)} onClick={deleteContact}>Delete contact</MenuItem>
                                            <MenuItem onMouseEnter={()=> handleBlockId(e._id)} onClick={bloqUser}>Block user</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </div>)
                    })
                    : filterContactsUsers?.map((e) => {
                        return(
                            <div key={e._id} className={s.profileUsers}>
                                <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                                <span>{e.nickName}</span>
                                <div className={s.arrowDown}>
                                    <Menu>
                                        <MenuButton><IoIosArrowDown/></MenuButton>
                                        <MenuList>
                                            <MenuItem onMouseEnter={()=> handleDatosChat(e._id)} onClick={handleNewChat}>New chat</MenuItem>
                                            <MenuItem onMouseEnter={()=> loadData(e._id)} onClick={deleteContact}>Delete contact</MenuItem>
                                            <MenuItem onMouseEnter={()=> handleBlockId(e._id)} onClick={bloqUser}>Block user</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </div>)
                    })
                }
                </div>
        </div>)
}

