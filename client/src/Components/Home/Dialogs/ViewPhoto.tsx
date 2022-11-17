import {
    AlertDialog,
    AlertDialogOverlay
  } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { Chats } from '../../../types'
import s from './ViewPhoto.module.css'

interface Props {
    setViewPhoto: Dispatch<SetStateAction<boolean>>
    currentChat: string
    filterGroupChat: Chats
}

export default function ViewPhoto({setViewPhoto, currentChat, filterGroupChat}: Props) {
    const [open, setOpen] = useState(true)
    const cancelRef: any = useRef()

    const onClose = () => {
        setOpen(false)
        setViewPhoto(false)
    }

    
    return (
        <>
          <AlertDialog
            isOpen={open}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <div className={s.divCloseDialog}>
                <img src={filterGroupChat?.img} alt="asd" width='48px' className={s.imgChica}/>
                <p>{filterGroupChat?.groupName}</p>
                <span ref={cancelRef} onClick={onClose} className={s.close}>X</span>
              </div>
              <div className={s.divImgGrande}>
                <img src={filterGroupChat.img} alt="" className={s.imgGrande}/>
              </div>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )
}