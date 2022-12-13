import { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import s from './Login.module.css'
import { Button, Input } from "@chakra-ui/react"

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

    const [error,setError] = useState('')
    const [attemps,setAttemps] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await login(user.userEmail,user.password)
            navigate('/verification')
        } catch (error: any) {
                setError(error)
                setAttemps(error)
        }    
    }

    console.log(navigator.languages)

    return(
        <div >
            <div className={s.contenedor}>
            <h1 className={s.tituloLogin}>Login to FastChat!</h1>
            <form onSubmit={e => handleSubmit(e)} className={s.formLogin}>
                    {
                        (error !== ''  || (error.toString().includes('(auth/user-not-found)') || error.toString().includes('(auth/wrong-password)') )) && <p className={s.mensajeError}>Email and password do not match.</p>
                    }
                    {
                        attemps.toString().includes('(auth/too-many-requests)') && <p className={s.mensajeError}>Too many attemps, try again later.</p>
                    }
                <div className={s.divsForm}>
                    <label>Email: </label>
                    <Input type="email" name="userEmail" value={user.userEmail} onChange={handleChange} isInvalid={error !== '' && error.toString().includes('(auth/user-not-found)') ? true : false} errorBorderColor='crimson'/>
                </div>
                <div className={s.divsForm}>
                    <label>Password: </label>
                    <Input type="password" name="password" value={user.password} onChange={handleChange} isInvalid={error !== '' && error.toString().includes('(auth/wrong-password)') ? true : false} errorBorderColor='crimson'/>
                </div>
                <Button type="submit">Login</Button>
            <div className={s.divLinkRegister}>
                <p>Don't have an account? <Link to='/register' className={s.linkRegister}>Register</Link></p>
            </div>
            </form>
            </div>
            <div className={s.textoCreadores}>
                    <p>Created by Iñaki Elhaiek & Agop Chorbadjian</p>
                </div>
        </div>)
}