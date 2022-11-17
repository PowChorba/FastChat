import { Input, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { useState } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { UNBLOCK_USER } from "../../../Redux/actions/actions"
import { useAppDispatch } from "../../../Redux/hooks"
import { User } from "../../../types"
import s from './BlockUsers.module.css'

interface Props {
    currentUser: User
}

export default function BlockUsers({currentUser}: Props){
    const dispatch = useAppDispatch()
    const [busqueda, setBusqueda] = useState('')
    const [unblock, setUnBlock] = useState({
        userId: '',
        bloqUserId: ''
    })

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }

    const busquedaBlock = currentUser?.bloqUsers?.filter(e => e.nickName === busqueda 
        || e.nickName.toLowerCase() === busqueda
        || e.nickName.toUpperCase() === busqueda)
    
    
    const getUserId = (e: string) => {
        if (currentUser?._id !== undefined && e) {
            setUnBlock({
                userId: currentUser._id,
                bloqUserId: e
            })
        }
    }    

    const deleteBlockUser = () => {
        dispatch(UNBLOCK_USER(unblock))
    }

    return(
        <div>
            <div className={s.formInput}>
                    <Input variant='filled' type="text" placeholder="Search Block Users" value={busqueda} onChange={handleBusqueda}/>
            </div>
            {
                    currentUser && currentUser.bloqUsers?.length === 0 ? <p className={s.textNotBlock}>Not block Users.</p>
                    : busquedaBlock?.length !== 0 
                    ? busquedaBlock?.map(e => {
                        return(
                            <div key={e._id} className={s.profileUsers}>
                                <div className={s.profileUsers}>
                                <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                                <span>{e.nickName}</span>
                                <br />
                                <div className={s.arrowDown}>
                                    <Menu>
                                        <MenuButton><IoIosArrowDown/></MenuButton>
                                        <MenuList>
                                            <MenuItem onMouseEnter={() => getUserId(e._id)} onClick={deleteBlockUser}>Unblock</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                                </div>
                            </div>)
                    })
                    : currentUser?.bloqUsers?.map((e) => {
                        return(
                            <div key={e._id} className={s.profileUsers}>
                                <div className={s.profileUsers}>
                                <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                                <span>{e.nickName}</span>
                                <br />
                                <div className={s.arrowDown}>
                                    <Menu>
                                        <MenuButton><IoIosArrowDown/></MenuButton>
                                        <MenuList>
                                            <MenuItem onMouseEnter={() => getUserId(e._id)} onClick={deleteBlockUser}>Unblock</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                                </div>
                            </div>)
                    })
                }
        </div>)
}
