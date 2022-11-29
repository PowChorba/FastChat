import { getAuth, sendEmailVerification, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import s from './Verification.module.css'

export default function Verification(){
    const auth = getAuth()
    const navigate = useNavigate()

    //DESLOGEAR
    const logOut = () => {
        signOut(auth)
        navigate('/')
    }

    const handleVerification = () => {
        if(auth.currentUser){
            sendEmailVerification(auth.currentUser)
            logOut()
            navigate('/')
        }
    }
    useEffect(() => {
        if(auth.currentUser?.emailVerified === true){
            navigate('/home')
        }
    }, [auth,navigate]) 

    return(
        <div className={s.contenedor}>
            <h1 className={s.titulo}>Verificacion Email</h1>
            <p>Please click the following <b className={s.bText} onClick={handleVerification}>link</b> to recive a verification email...</p>    
        </div>)
}