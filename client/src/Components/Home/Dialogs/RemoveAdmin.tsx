import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
  } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { REMOVE_ADMIN, UPDATE_GROUP } from '../../../Redux/actions/actions'
import { useAppDispatch } from '../../../Redux/hooks'

interface Props {
    setRemoveAdmin: Dispatch<SetStateAction<boolean>>
    currentChat: string
    userRemove: string
}

export default function RemoveAdmins({setRemoveAdmin, currentChat, userRemove}: Props) {
    const [open, setOpen] = useState(true)
    const cancelRef: any = useRef()
    const dispatch = useAppDispatch()
    const [removeAdmin, setRemoveeAdmin] = useState({
        groupId: '',
        removeAdmin: ''
    })

    const onClose = () => {
        setOpen(false)
        setRemoveAdmin(false)
    }

    const handleData = () => {
        if(currentChat){
            setRemoveeAdmin({
                groupId: currentChat,
                removeAdmin: userRemove
            })
        }
    }

    const handleAddUser = () => {
        dispatch(REMOVE_ADMIN(removeAdmin))
        setOpen(false)
        setRemoveAdmin(false)
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
                  {`Remove this user from admins?`}
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