import axios from "axios"
import { useState } from "react"
import { USER_CONTACTS } from "../../../Redux/actions/actions"
import { useAppDispatch } from "../../../Redux/hooks"
import { User } from "../../../types"
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { Button } from '@chakra-ui/react'

interface Props {
    currentUser: User
}

export default function Profile({currentUser}: Props){
    const dispatch = useAppDispatch()
    const [user, setUser] = useState({
        userId: '',
        image: '',
        nickName: '',
        password: ''
    })

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(!show)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(currentUser._id){
            setUser({
                ...user,
                userId: currentUser._id,
                [e.target.name]: e.target.value
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
    
          setUser({
            ...user,
            image: cloudinary.data?.secure_url,
          });
        } catch (error) {
          console.log(error);
        }
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(USER_CONTACTS(user))
        setUser({
            userId: '',
            image: '',
            nickName: '',
            password: ''
        })
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <Input type="file" accept="image/jpeg, image/png" name="image" onChange={handleImage} placeholder={currentUser?.image} size='sx'/>
                </div>
                <div>
                    <Input type="text" name="nickName" value={user.nickName} onChange={handleChange} placeholder={currentUser?.nickName}/>
                </div>
                <div>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} placeholder='New password' name="password" value={user.password} onChange={handleChange}/>
                    <InputRightElement>
                        <Button onClick={handleShow}>{show ? 'Hide' : 'Show'}</Button>
                    </InputRightElement>
                </InputGroup>
                </div>
                <button type="submit">Update</button>
            </form>
        </div>)
}