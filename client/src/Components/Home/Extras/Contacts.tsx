import { useState } from "react"
import { NEW_CHAT } from "../../../Redux/actions/actions"
import { useAppDispatch } from "../../../Redux/hooks"
import { User } from "../../../types"
import s from './Users.module.css'

interface Props {
    currentUser: User
}


export default function Contacts({currentUser}: Props) {
    const dispatch = useAppDispatch()
    
    const [newChat, setNewChat] = useState({
        firstUser: '',
        secondUser: ''
    })


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

    return(
        <div>
            <form>
                    <input type="text" placeholder="Seach contacts" />
                </form>
                {
                    currentUser && currentUser.contacts?.length === 0 ? <p>No tienes contactos.</p>
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