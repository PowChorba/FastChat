import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthRouteProps {
    children: React.ReactNode
}

const AuthRoutee: React.FunctionComponent<AuthRouteProps> = ({children}: AuthRouteProps) =>{
    const auth = getAuth()
    const [loading, setLoading ] = useState(true)
    const navigte = useNavigate()

    // useEffect(() =>{
    //     AuthCheck()
    // })

    const AuthCheck = onAuthStateChanged(auth, (user) => {
        if(user){
            setLoading(false)
        }else {
            console.log('Acceso denegado')
            navigte('/')
        }
    })


    if(!loading){
        navigte('/home')
    }

    return <>{children}</>

}

export default AuthRoutee