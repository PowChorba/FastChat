import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export interface AuthRouteProps {}

const AuthRoute: React.FunctionComponent<AuthRouteProps> = (props) =>{
    const { children }: any = props
    const auth = getAuth()
    const [loading, setLoading ] = useState(true)
    const navigte = useNavigate()

    useEffect(() => {
        AuthCheck()
    })

    const AuthCheck = onAuthStateChanged(auth, (user) => {
        console.log(user)
        if(user){
            setLoading(false)
        }else {
            console.log('Acceso denegado')
            navigte('/login')
        }
    })

    if(loading){
        return <h1>Loading...</h1>
    }

    return <>{children}</>
}

export default AuthRoute