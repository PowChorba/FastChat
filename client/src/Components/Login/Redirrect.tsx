import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    children: React.ReactNode
}

export default function Redirrect({children}: Props)  {
    const auth = getAuth()
    const navigate = useNavigate()
    const [logeado, setLogeado] = useState(false)


    useEffect(() => {
        AuthCheck() 
    }) 
    
    const AuthCheck = onAuthStateChanged(auth, (user) => {
        if(user){
            setLogeado(true)
        }
    })

    if(logeado){
        navigate('/home')
    }

    return <>{children}</>
}