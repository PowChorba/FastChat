import { Button, Input } from "@chakra-ui/react"
import axios from "axios"
import { useState } from "react"
import { CREATE_GROUP_CHAT } from "../../../Redux/actions/actions"
import { useAppDispatch } from "../../../Redux/hooks"
import { User } from "../../../types"
import defaultImage from '../../../assets/deafultImage.png'
import s from './ChatGroups.module.css'

interface Props {
    currentUser: User
}

export default function ChatGroups({currentUser}: Props){
    const dispatch = useAppDispatch()
    const [group, setGroup] = useState({
        img: '',
        groupName: '',
        admin: '',
        chatsUsersId: ''
    })
    
    const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(currentUser){
            setGroup({
                ...group,
                groupName: e.target.value,
                admin: currentUser?._id,
                chatsUsersId: currentUser?._id
            })
        }
    }

    const handleImage = async (e: any) => {
        try {
          const file = e.target.files[0];
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "FastChat");
    
          const cloudinary = await axios.post('https://api.cloudinary.com/v1_1/powchorba/image/upload', data);
    
          setGroup({
            ...group,
            img: cloudinary.data?.secure_url,
          });
        } catch (error) {
          console.log(error);
        }
    };

    console.log(group?.img)
    const handleCreateGroup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(CREATE_GROUP_CHAT(group))
        setTimeout(() => {
            window.location.reload()
        }, 1500)
    } 

    return(
        <div>
            <form onSubmit={handleCreateGroup} className={s.contenedor}>
                <div className={s.inputs}>
                    <label htmlFor="inputTaag">
                        <img src={group.img === '' ? defaultImage : group.img} alt="asd" width='150x' className={s.profileImage}/>
                        <Input id="inputTaag" type="file" accept="image/jpeg, image/png" name="image" onChange={handleImage} className={s.inputImage} size='sx'/>
                    </label>
                </div>
                <div className={s.inputs}>
                    <Input type="text" name="groupName" value={group.groupName} onChange={handleLabel} placeholder='Name'/>
                </div>
                <Button variant='outline' colorScheme='teal' type="submit">Create Group</Button>
            </form>
        </div>)
}