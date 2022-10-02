import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth'

export default function Login(){
    const [user, setUser] = useState({
        userEmail: '',
        password: ''
    })
    const navigate = useNavigate()
    const auth = getAuth()

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await login(user.userEmail,user.password)
            navigate('/home')
        } catch (error) {
            console.log(error)
        }    
    }

    return(
        <div>
            <h1>Login with your User</h1>
            <form onSubmit={e => handleSubmit(e)}>
                <div>
                    <label>Email: </label>
                    <input type="email" name="userEmail" value={user.userEmail} onChange={handleChange} />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" name="password" value={user.password} onChange={handleChange} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>)
}