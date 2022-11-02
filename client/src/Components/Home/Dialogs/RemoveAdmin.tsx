import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
  } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { MAKE_ADMIN_GROUP, REMOVE_ADMIN_GROUP } from '../../../Redux/actions/actions'
import { useAppDispatch } from '../../../Redux/hooks'
import { User } from '../../../types'

interface Props {
    setRemoveAdmin: Dispatch<SetStateAction<boolean>>
    currentChat: string
    userRemove: User
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
                removeAdmin: userRemove?._id
            })
        }
    }

    const handleAddUser = () => {
        dispatch(REMOVE_ADMIN_GROUP(removeAdmin))
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
                  {`Remove ${userRemove?.nickName} from admins?`}
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