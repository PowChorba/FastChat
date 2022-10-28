import { Input } from "@chakra-ui/react"
import { useState } from "react"
import { User } from "../../../types"
import s from './BlockUsers.module.css'

interface Props {
    currentUser: User
}

export default function BlockUsers({currentUser}: Props){
    
    const [busqueda, setBusqueda] = useState('')

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }

    const busquedaBlock = currentUser?.bloqUsers?.filter(e => e.nickName === busqueda 
        || e.nickName.toLowerCase() === busqueda
        || e.nickName.toUpperCase() === busqueda)
    
    return(
        <div>
            <div className={s.formInput}>
                    <Input variant='filled' type="text" placeholder="Search Block Users" value={busqueda} onChange={handleBusqueda}/>
            </div>
            {
                    currentUser && currentUser.bloqUsers?.length === 0 ? <p>Not block Users.</p>
                    : busquedaBlock?.length !== 0 
                    ? busquedaBlock?.map(e => {
                        return(
                            <div key={e._id}>
                                <button value={e._id} className={s.profileUsers}>
                                <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                                <span>{e.nickName}</span>
                                <br />
                                </button>
                            </div>)
                    })
                    : currentUser?.bloqUsers?.map((e) => {
                        return(
                            <div key={e._id}>
                                <button value={e._id} className={s.profileUsers}>
                                <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                                <span>{e.nickName}</span>
                                <br />
                                </button>
                            </div>)
                    })
                }
        </div>)
}

// onMouseEnter={()=> handleDatosChat(e._id)} onClick={handleNewChat}