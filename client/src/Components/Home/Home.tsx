import { useAppDispatch, useAppSelector } from "../../Redux/hooks"
import { useEffect} from 'react'
import { ALL_USERS } from "../../Redux/actions/actions"

export default function Home(){
    const allUsers = useAppSelector(state => state.clientReducer.users)
    const dispatch = useAppDispatch()

    console.log(allUsers)
    
    useEffect(() =>{
        dispatch(ALL_USERS())
    }, [dispatch])

    return(
        <div>
            <h1>Home</h1>
        </div>)
}