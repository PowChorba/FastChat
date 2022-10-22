import { useState } from "react"
import { CreateUser } from "../../types"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { useAppDispatch } from "../../Redux/hooks"
import { useNavigate } from 'react-router-dom'
import { NEW_USER } from "../../Redux/actions/actions"
import axios from 'axios'
import s from './Register.module.css'
import { Button, Input } from "@chakra-ui/react"
import defaultImage from '../../assets/deafultImage.png'
import { BsArrowLeft } from 'react-icons/bs'

interface FormState{
    inputValue: CreateUser
}



export default function Register() {
    const [user, setUser] = useState<FormState['inputValue']>({
        nickName: '',
        userEmail: '',
        password: '',
        image: ''
    })

    const auth = getAuth()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await signUp(user.userEmail, user.password)
            dispatch(NEW_USER(user))
            navigate('/home')
        } catch (error) {
            console.log(error)
        }
    }

    const goBack = () =>{
        window.history.back()
    }

    return(
        <div className={s.contenedor}>
            <div>
            </div>
            <form onSubmit={(e) => handleSubmit(e)} className={s.formLogin}>
                <BsArrowLeft className={s.arrowBack} onClick={goBack}/>
                <div>
                    <label htmlFor="inputTag">
                        <img src={user.image === '' ? defaultImage : user.image} alt="asd" width='150x' className={s.imagePorfile}/>
                        <Input id="inputTag" type="file" accept="image/jpeg, image/png" name="image" onChange={handleImage} className={s.inputNone}/>
                    </label>
                </div>
                <div className={s.labelRegister}>
                    <label>Nickname: </label>
                    <Input type="text" name="nickName" value={user.nickName} onChange={handleChange}/>
                </div>
                <div className={s.labelRegister}>
                    <label>Email: </label>
                    <Input type="email" name="userEmail" value={user.userEmail} onChange={handleChange}/>
                </div>
                <div className={s.labelRegister}>
                    <label>Password: </label>
                    <Input type="password" name="password" value={user.password} onChange={handleChange}/>
                </div>
                <Button type="submit" className={s.buttonRegister}>Register</Button>
            </form>
        </div>)
}