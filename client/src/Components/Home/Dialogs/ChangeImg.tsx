import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    Input,
  } from '@chakra-ui/react'
import axios from 'axios'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { UPDATE_GROUP } from '../../../Redux/actions/actions'
import { useAppDispatch } from '../../../Redux/hooks'
import { Chats } from '../../../types'
import s from './ChangeImg.module.css'

interface Props {
    setActiveDialogImg: Dispatch<SetStateAction<boolean>>
    currentChat: string
    filterGroupChat: Chats
}

export default function ChangeImg({setActiveDialogImg, currentChat, filterGroupChat}: Props) {
    const [open, setOpen] = useState(true)
    const cancelRef: any = useRef()
    const dispatch = useAppDispatch()
    //PARA PODER MODIFICAR LA IMAGEN
    const [inputImg, setInputImg] = useState({
        groupId: '',
        img: ''
    })


  const handleImage = async (e: any) => {
    try {
      const file = e.target.files[0];
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "FastChat");

      const cloudinary = await axios.post('https://api.cloudinary.com/v1_1/powchorba/image/upload', data);

      setInputImg({
        groupId: currentChat,
        img: cloudinary.data?.secure_url,
      });
    } catch (error) {
      console.log(error);
    }
  };

    const onClose = () => {
        setOpen(false)
        setActiveDialogImg(false)
    }

    

    const handleAddUser = () => {
        dispatch(UPDATE_GROUP(inputImg))
        setOpen(false)
        setActiveDialogImg(false)
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
                  <form>
          <label htmlFor="groupImgModify">
            <img src={filterGroupChat?.img} alt="asd" width='200px' className={s.imagen}/>
            <Input type="file" accept="image/jpeg, image/png" id="groupImgModify" name="img" onChange={handleImage} className={s.hide}/>
          </label>
        </form>
                </AlertDialogBody>
    
                <AlertDialogFooter className={s.footer}>
                  <Button ref={cancelRef} onClick={onClose} variant='outline'>
                    Cancel
                  </Button>
                  <Button colorScheme='teal' ml={3} variant='outline' onClick={handleAddUser}>
                    Accept
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )
}