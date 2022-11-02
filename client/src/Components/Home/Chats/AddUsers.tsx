import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
  } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { ADD_USER_GROUP } from '../../../Redux/actions/actions'
import { useAppDispatch } from '../../../Redux/hooks'
import { User } from '../../../types'

interface Props {
    setDialog: Dispatch<SetStateAction<boolean>>
    currentUser: User
    currentChat: string
}

export default function AddUsers({setDialog, currentUser, currentChat}: Props) {
    const [open, setOpen] = useState(true)
    const cancelRef: any = useRef()
    const dispatch = useAppDispatch()
    const [addUser, setAddUser] = useState({
        groupId: '',
        members: ''
    })

    const onClose = () => {
        setOpen(false)
        setDialog(false)
    }

    const handleOnChange = (e: any) => {
        if(currentChat){
            setAddUser({
                groupId: currentChat,
                members: e.target.value
            })
        }
    }

    const handleAddUser = () => {
        dispatch(ADD_USER_GROUP(addUser))
        setOpen(false)
        setDialog(false)
    }

    console.log(addUser)

    return (
        <>
          <AlertDialog
            isOpen={open}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Add Users to Group
                </AlertDialogHeader>
    
                <AlertDialogBody>
                  {
                    currentUser?.contacts && currentUser?.contacts.map(e => {
                        return(
                            <div key={e._id}>
                                <input type="checkbox" value={e._id} onChange={handleOnChange}/>
                                <img src={e.image} alt="asd" width='48px'/>
                                <span>{e.nickName}</span>
                            </div>)
                    })
                  }
                </AlertDialogBody>
    
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose} variant='outline'>
                    Cancel
                  </Button>
                  <Button colorScheme='teal' ml={3} variant='outline' onClick={handleAddUser}>
                    Add to Group
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )
}