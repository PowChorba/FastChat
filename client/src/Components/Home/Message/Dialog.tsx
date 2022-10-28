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
import { DELETE_MESSAGE } from '../../../Redux/actions/actions'
import { useAppDispatch } from '../../../Redux/hooks'

interface Props {
    setDialog: Dispatch<SetStateAction<boolean>>
    messageId: string
}

export default function DeleteMessage({setDialog, messageId}: Props) {
    const [open, setOpen] = useState(true)
    const cancelRef: any = useRef()
    const dispatch = useAppDispatch()

    const onClose = () => {
        setOpen(false)
        setDialog(false)
    }

    const deleteMessage = () => {
        dispatch(DELETE_MESSAGE(messageId))
        setOpen(false)
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
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Message
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} variant='outline'>
                  Cancel
                </Button>
                <Button colorScheme='teal' onClick={deleteMessage} ml={3} variant='outline'>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }