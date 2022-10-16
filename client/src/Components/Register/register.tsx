import { useState } from "react"
import { CreateUser } from "../../types"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { useAppDispatch } from "../../Redux/hooks"
import { useNavigate } from 'react-router-dom'
import { NEW_USER } from "../../Redux/actions/actions"
import axios from 'axios'

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

    return(
        <div>
            <h1>Create your user!</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <label>Profile Photo:</label>
                    <input type="file" accept="image/jpeg, image/png" name="image" onChange={handleImage}/>
                </div>
                <div>
                    <label>Nickname: </label>
                    <input type="text" name="nickName" value={user.nickName} onChange={handleChange}/>
                </div>
                <div>
                    <label>Email: </label>
                    <input type="email" name="userEmail" value={user.userEmail} onChange={handleChange}/>
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" name="password" value={user.password} onChange={handleChange}/>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>)
}