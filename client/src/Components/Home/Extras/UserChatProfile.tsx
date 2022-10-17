import { User } from "../../../types"
import { Button } from "@chakra-ui/react"
import s from './ChatProfile.module.css'

interface Props {
    user: User
}

export default function ChatProfile({user}: Props){
    return(
        <div className={s.contenedor}>
            <img src={user?.image} alt="asd" width='250px' className={s.imagen}/>
            <h4>{user?.nickName}</h4>
            <p>{user?.userEmail}</p>
            <Button colorScheme='red' variant='outline'>Eliminar chat</Button>
        </div>)
}