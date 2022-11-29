import { useState } from "react"
import { CreateUser } from "../../types"
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth"
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
    const [errorEmail, setErrorEmail] = useState('')


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
            if(user.image === '') user.image = defaultImage
            dispatch(NEW_USER(user))
            navigate('/verification')
        } catch (error: any) {
            console.log(error)
            setErrorEmail(error)
        }
    }

    const goBack = () =>{
        window.history.back()
    }

    return(
        <div className={s.contenedor}>
            <form onSubmit={(e) => handleSubmit(e)} className={s.formLogin}>
                <BsArrowLeft className={s.arrowBack} onClick={goBack}/>
                <div>
                    <label htmlFor="inputTag">
                        <img src={user.image === '' ? defaultImage : user.image} alt="asd" width='150x' className={s.imagePorfile}/>
                        <Input id="inputTag" type="file" accept="image/jpeg, image/png" name="image" onChange={handleImage} className={s.inputNone}/>
                    </label>
                </div>
                {
                    user.nickName === '' || user.nickName.length > 2
                    ? <div className={s.labelRegister}>
                    <label>Nickname: </label>
                    <Input type="text" name="nickName" focusBorderColor='teal.500' value={user.nickName} onChange={handleChange}/>
                    </div>
                    : <div className={s.labelRegister}>
                        <label>Nickname: </label>
                        <Input type="text" name="nickName" isInvalid focusBorderColor='teal.500' errorBorderColor='crimson' value={user.nickName} onChange={handleChange}/>
                    </div>
                }
                {
                    user.userEmail === '' || user.userEmail.length > 5
                    ? <div className={s.labelRegister}>
                        <label>Email: </label>
                        <Input type="email" name="userEmail" focusBorderColor='teal.500' value={user.userEmail} onChange={handleChange}/>
                      </div> 
                    : <div className={s.labelRegister}>
                        <label>Email: </label>
                        <Input type="email" name="userEmail" isInvalid focusBorderColor='teal.500' errorBorderColor='crimson' value={user.userEmail} onChange={handleChange}/>
                      </div>  
                }
                {
                    user.password === '' || user.password.length > 5 
                    ? <div className={s.labelRegister}>
                        <label>Password: </label>
                        <Input type="password" name="password" focusBorderColor='teal.500' value={user.password} onChange={handleChange}/>
                    </div>
                    : <div className={s.labelRegister}>
                        <label>Password: </label>
                        <Input type="password" isInvalid focusBorderColor='teal.500' errorBorderColor='crimson' name="password" value={user.password} onChange={handleChange}/>
                      </div>
                }
                {
                    (errorEmail !== '' || errorEmail.toString().includes('(auth/email-already-in-use)')) && <p className={s.mensajeError}>Email already in use</p>
                }
                <Button type="submit" className={s.buttonRegister} disabled={user.nickName === '' || user.password === '' || user.userEmail === '' || user.password.length < 6 ? true : false}>Register</Button>
            </form>
        </div>)
}