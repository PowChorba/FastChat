import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
  } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import {  SET_ADMIN, UPDATE_GROUP } from '../../../Redux/actions/actions'
import { useAppDispatch } from '../../../Redux/hooks'

interface Props {
    setAddAdmin: Dispatch<SetStateAction<boolean>>
    currentChat: string
    userRemove: string
}

export default function Admins({setAddAdmin, currentChat, userRemove}: Props) {
    const [open, setOpen] = useState(true)
    const cancelRef: any = useRef()
    const dispatch = useAppDispatch()
    const [admin, setAdmin] = useState({
        groupId: '',
        admin: ''
    })
    
    const onClose = () => {
        setOpen(false)
        setAddAdmin(false)
    }

    const handleData = () => {
        if(currentChat){
            setAdmin({
                groupId: currentChat,
                admin: userRemove
            })
        }
    }

    const handleAddUser = () => {
        dispatch(SET_ADMIN(admin))
        setOpen(false)
        setAddAdmin(false)
    }


    return (
        <>
          <AlertDialog
            isOpen={open}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                   
                <AlertDialogBody>
                  {`Upgrade user to admin?`}
                </AlertDialogBody>
    
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose} variant='outline'>
                    Cancel
                  </Button>
                  <Button colorScheme='teal' ml={3} variant='outline' onMouseEnter={handleData} onClick={handleAddUser}>
                    Accept
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )
}