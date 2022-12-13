import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Input,
} from '@chakra-ui/react'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { ADD_USER, UPDATE_GROUP } from '../../../Redux/actions/actions'
import { useAppDispatch } from '../../../Redux/hooks'
import { Chats, User } from '../../../types'
import s from './AddUsers.module.css'

interface Props {
  socket: any
  setDialog: Dispatch<SetStateAction<boolean>>
  currentUser: User
  currentChat: string
  filterGroupChat: Chats
}

export default function AddUsers({ socket,setDialog, currentUser, currentChat, filterGroupChat }: Props) {
  const [open, setOpen] = useState(true)
  const cancelRef: any = useRef()
  const dispatch = useAppDispatch()
  const [addUser, setAddUser] = useState({
    groupId: '',
    members: ''
  })
  //FILTRADO PARA VER SI EL USUARIO YA SE ENCUNENTRA EN EL GRUPO
  const alreadyOnGroup = filterGroupChat.chatsUsers.map(e => e._id)

  //PARA BUSCAR EL CONTACTO ESPECIFICO
  const [inputContact, setInputContact] = useState('')

  const handleInputContact = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContact(e.target.value)
  }

  const searchContact = currentUser.contacts?.filter(e => e.nickName === inputContact
    || e.nickName === inputContact
    || e.nickName.toLowerCase() === inputContact
    || e.nickName.toLowerCase() === inputContact
    || e.nickName.toUpperCase() === inputContact
    || e.nickName.toUpperCase() === inputContact
  )

  const onClose = () => {
    setOpen(false)
    setDialog(false)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentChat) {
      if (addUser.members === '') {
        setAddUser({
          groupId: currentChat,
          members: e.target.value
        })
      } else if (addUser !== null && addUser.members !== e.target.value) {
        const checkedBox = document.getElementById(addUser.members) as HTMLInputElement
        checkedBox!.checked = false
        setAddUser({
          groupId: currentChat,
          members: e.target.value
        })
      }
    }
  }

  const handleAddUser = () => {
    dispatch(ADD_USER(addUser))
    socket.emit("joinGroupChat", {
      ...addUser
    })
    setOpen(false)
    setDialog(false)
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
            <AlertDialogHeader fontSize='lg' fontWeight='bold' className={s.alertHeader}>
              <span ref={cancelRef} onClick={onClose} className={s.closeSpan}>X</span>
              Add Users to Group
            </AlertDialogHeader>

            <AlertDialogBody>
              <Input type="text" placeholder='Search contact..' value={inputContact} onChange={handleInputContact} className={s.inputSearch} />
              {
                searchContact?.length !== 0
                  ? <div className={s.listOverFlow}>
                    <p>Contacts</p>
                    <div>
                      {
                        searchContact && searchContact.map(e => {
                          return (
                            <div key={e._id} className={s.contenedorMap}>
                              {
                                alreadyOnGroup.includes(e._id) ? '' : <input id={e._id} type="checkbox" value={e._id} name={e._id} onChange={handleOnChange} />
                              }
                              <img src={e.image} alt="asd" width='48px' className={s.contenedorImg} />
                              <div className={s.divNickText}>
                                <span>{e.nickName}</span>
                                <p className={s.textAlready}>
                                  {
                                    alreadyOnGroup.includes(e._id) ? 'User already on group' : ''
                                  }
                                </p>
                              </div>
                            </div>)
                        })
                      }
                    </div>
                  </div>
                  : <div>
                    <p>Contacts</p>
                    <div className={s.listOverFlow}>
                      {
                        currentUser?.contacts && currentUser?.contacts.map(e => {
                          return (
                            <div key={e._id} className={s.contenedorMap}>
                              {
                                alreadyOnGroup.includes(e._id) ? '' : <input id={e._id} type="checkbox" value={e._id} name={e._id} onChange={handleOnChange} className={s.inputCheckBox} />
                              }
                              <img src={e.image} alt="asd" width='48px' className={s.contenedorImg} />
                              <div className={s.divNickText}>
                                <span>{e.nickName}</span>
                                <p className={s.textAlready}>
                                  {
                                    alreadyOnGroup.includes(e._id) ? 'User already on group' : ''
                                  }
                                </p>
                              </div>
                            </div>)
                        })
                      }
                    </div>
                  </div>
              }
            </AlertDialogBody>

            <AlertDialogFooter>
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