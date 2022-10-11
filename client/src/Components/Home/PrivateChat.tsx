import { useAppSelector } from "../../Redux/hooks"
import { User } from "../../types"

interface Props {
    chatUser: string[] 
    currentUser: User | undefined
}

export default function PrivateChat({chatUser, currentUser}: Props ) {
    const user = useAppSelector(state => state.clientReducer.users)
    const secondUserId = chatUser.find((e: string) => e !== currentUser?._id)
    const userFriend = user?.find(e => e._id === secondUserId)


    
    return(
        <div>
            <p>{userFriend?.nickName}</p>
        </div>)
}