import {
    AlertDialog,
    AlertDialogOverlay
  } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { User } from '../../../types'
import s from './ViewPhoto.module.css'

interface Props {
    setOpenImg: Dispatch<SetStateAction<boolean>>
    userImage: User
}

export default function UserPhoto({setOpenImg, userImage}: Props) {
    const [open, setOpen] = useState(true)
    const cancelRef: any = useRef()

    const onClose = () => {
        setOpen(false)
        setOpenImg(false)
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
                <img src={userImage.image} alt="asd" width='48px' className={s.imgChica}/>
                <p>{userImage.nickName}</p>
                <span ref={cancelRef} onClick={onClose} className={s.close}>X</span>
              </div>
              <div className={s.divImgGrande}>
                <img src={userImage.image} alt="" className={s.imgGrande}/>
              </div>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )
}