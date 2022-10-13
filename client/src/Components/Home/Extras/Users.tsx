import { useEffect, useState } from "react"
import { ALL_USERS, USER_CONTACTS, USER_FILTER } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { User } from "../../../types"
import s from './Users.module.css'

interface Props {
    currentUser: User
}


export default function Users({currentUser}: Props){    
    const searchUser = useAppSelector(state => state.clientReducer.searchUser)
    const allUsers = useAppSelector(state => state.clientReducer.users)
    const filterUsers = allUsers.filter(e => e._id !== currentUser?._id)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(ALL_USERS())
    })

    //BUSQUEDA DE CONTACTOS
    const [busqueda, setBusqueda] = useState('')

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }

    const handleSubmitBusqueda = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(USER_FILTER(busqueda))
    }


    //ADD CONTACT
    const [asd, setAsd] = useState({
        userId: '',
        contact: ''
    })

    const handleDataNewContact = (e: any) => {
        if(currentUser._id !== undefined){
            setAsd({
                userId: currentUser._id,
                contact: e
            })
        }
    }

    const handleNewContact = () => {
        dispatch(USER_CONTACTS(asd))
    }

    return(
        <div>
            
            <form onSubmit={handleSubmitBusqueda} className={s.formBusqueda}>
                <input type="text" name="busqueda" value={busqueda} onChange={handleBusqueda} placeholder='Search user...'/>
                <button type="submit" className={busqueda === '' ? s.noneButton : s.sendMensaje}>Search</button>
            </form>
                {
                    searchUser.length === 0 ? filterUsers.map(e => {
                        return(<div key={e._id}>
                            <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                            <span>{e.nickName}</span>
                            <button className={s.sendMensaje} onMouseEnter={() => handleDataNewContact(e._id)} onClick={handleNewContact}>Add Contact</button>
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
            
        </div>)
}