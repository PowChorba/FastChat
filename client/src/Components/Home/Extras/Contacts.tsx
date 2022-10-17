import { useState } from "react"
import { NEW_CHAT } from "../../../Redux/actions/actions"
import { useAppDispatch } from "../../../Redux/hooks"
import { User } from "../../../types"
import s from '../Users/Users.module.css'

interface Props {
    currentUser: User
}


export default function Contacts({currentUser}: Props) {
    const dispatch = useAppDispatch()
    
    const [newChat, setNewChat] = useState({
        firstUser: '',
        secondUser: ''
    })
    const [busqueda, setBusqueda] = useState('')

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }

    const busquedaContacts = currentUser?.contacts?.filter(e => e.nickName === busqueda 
        || e.nickName.toLowerCase() === busqueda
        || e.nickName.toUpperCase() === busqueda)

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

    return(
        <div>
                <form>
                    <input type="text" placeholder="Seach contacts" value={busqueda} onChange={handleBusqueda}/>
                </form>
                {
                    currentUser && currentUser.contacts?.length === 0 ? <p>No tienes contactos.</p>
                    : busquedaContacts?.length !== 0 
                    ? busquedaContacts?.map(e => {
                        return(
                            <div key={e._id}>
                                <button value={e._id} onMouseEnter={()=> handleDatosChat(e._id)} onClick={handleNewChat}>
                                <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                                <span>{e.nickName}</span>
                                <br />
                                </button>
                            </div>)
                    })
                    : currentUser?.contacts?.map((e) => {
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
        </div>)
}