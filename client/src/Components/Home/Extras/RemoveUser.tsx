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
import { UPDATE_GROUP } from '../../../Redux/actions/actions'
import { useAppDispatch } from '../../../Redux/hooks'
import { Chats, User } from '../../../types'

interface Props {
    setDeleteDialog: Dispatch<SetStateAction<boolean>>
    filterGroupChat: Chats
    currentChat: string
    userRemove: string
}

export default function RemoveUser({setDeleteDialog, filterGroupChat, currentChat, userRemove}: Props) {
    const [open, setOpen] = useState(true)
    const cancelRef: any = useRef()
    const dispatch = useAppDispatch()
    const [removeUser, setRemoveUser] = useState({
        groupId: '',
        leaveGroup: ''
    })

    const onClose = () => {
        setOpen(false)
        setDeleteDialog(false)
    }

    const handleData = () => {
        if(currentChat){
            setRemoveUser({
                groupId: currentChat,
                leaveGroup: userRemove
            })
        }
    }

    const handleAddUser = () => {
        dispatch(UPDATE_GROUP(removeUser))
        setOpen(false)
        setDeleteDialog(false)
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
                  {`You wish to remove this user from '${filterGroupChat?.groupName}'?`}
                </AlertDialogBody>
    
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose} variant='outline'>
                    Cancel
                  </Button>
                  <Button colorScheme='teal' ml={3} variant='outline' onMouseEnter={handleData} onClick={handleAddUser}>
                    Remove from Group
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )
}