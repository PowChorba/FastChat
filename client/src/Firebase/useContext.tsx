import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { RaceBy } from "@uiball/loaders";
import s from './Context.module.css'
export interface AuthRouteProps {
    children: React.ReactNode
}

const AuthRoute: React.FunctionComponent<AuthRouteProps> = ({children}: AuthRouteProps) =>{
    const auth = getAuth()
    const [loading, setLoading ] = useState(true)
    const navigte = useNavigate()

    useEffect(() => {
        AuthCheck()
    })


    const AuthCheck = onAuthStateChanged(auth, (user) => {
        if(user && user.emailVerified === true){
            setLoading(false)
        }else if(user?.emailVerified === false){
            navigte('/verification')
        }
        else {
            console.log('Acceso denegado')
            navigte('/')
            
        }
    })

    if(loading){
        return <div className={s.loading}><RaceBy size={200} lineWeight={10} speed={1.5} color='black'/></div>
    }

    return <>{children}</>
}

export default AuthRoute