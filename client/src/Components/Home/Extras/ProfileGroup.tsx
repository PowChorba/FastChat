import React, { useState } from "react";
import { Chats, User } from "../../../types";
import AddUsers from "../Chats/AddUsers";
import s from "./ChatProfile.module.css";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineClose, AiOutlineCheck } from 'react-icons/ai'
import { Button, Input, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import RemoveUser from "./RemoveUser";
import Admins from "../Dialogs/Admins";
import RemoveAdmins from "../Dialogs/RemoveAdmin";
import { useAppDispatch } from "../../../Redux/hooks";
import { DELETE_CHAT, UPDATE_GROUP } from "../../../Redux/actions/actions";
import ChangeImg from "../Dialogs/ChangeImg";

interface Props {
  filterGroupChat: Chats;
  currentUser: User;
  currentChat: string;
}

export default function ProfileGroup({
  filterGroupChat,
  currentUser,
  currentChat,
}: Props) {
  const adminsId = filterGroupChat?.admin?.map((e) => e._id);
  const dispatch = useAppDispatch()
  //PARA MANDAR IDS A LOS DIALOGS
  const [ids, setIds] = useState('')
  //PROPIEDADES PARA AGERGAR USUARIOS AL CHAT
  const [dialog, setDialog] = useState(false);
  
  const handleClickDialog = () => {
    setDialog(!dialog);
  };

  //PROPIEDADES PARA ELEIMINAR USUARIOS DEL CHAT
  const [deleteDialog, setDeleteDialog] = useState(false)

  const handleRemoveUser = (e: string) => {
    setDeleteDialog(!deleteDialog)
    setIds(e)
  }

  //PROPIEDADES PARA AGREGAR ADMINS
  const [addAdmin, setAddAdmin] = useState(false)

  const handleAdmins = (e: string) => {
    setAddAdmin(!addAdmin)
    setIds(e)
  }

  //PROPIEDADES PARA ELIMINAR ADMINS
  const [removeAdmin, setRemoveAdmin] = useState(false)

  const handleRemoveAdmins = (e: string) => {
    setRemoveAdmin(!removeAdmin)
    setIds(e)
  }

  //PROPIEDADES PARA SALIR DEL GRUPO
  const [leave, setLeave] = useState({
    groupId: '',
    leaveGroup: ''
  })

  const handleMouse = () => {
    if(currentChat){
      setLeave({
        groupId: currentChat,
        leaveGroup: currentUser?._id
      })
    }
  }

  const handleLeaveGroup = () => {
    dispatch(UPDATE_GROUP(leave))
  }

  //ELIMINAR GROUP SI ES EL CREADOR
  const handleDeleteGroup = () => {
    dispatch(DELETE_CHAT(currentChat))
  }

  //PARA CAMBIAR EL NICK DEL GRUPO
  const [inputNick, setInputNick] = useState({
    groupId: '',
    groupName: ''
  })
  const [activeInput, setActiveInput] = useState(false)
  
  const handleActive = () => {
    setActiveInput(!activeInput)
  }

  const handleClose = () => {
    setActiveInput(false)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNick({
      groupId: currentChat,
      groupName: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(UPDATE_GROUP(inputNick))
    setTimeout(() => {
      window.location.reload()
    },1000)
  }

  //PARA UN POCO DE ESTETICA VISUAL
  const [activeMenu, setActiveMenu] = useState(false)

  const handleActiveMenu = () => {
    setActiveMenu(true)
  }

  const handleNoActiveMenu = () => {
    setActiveMenu(false)
  }

  //PARA LA IMAGEN
  const [activeDialogImg, setActiveDialogImg] = useState(false)
  
  const handleActiveDialogImg = () => {
    setActiveDialogImg(!activeDialogImg)
  }

  return (
    <div className={s.contenedor}>
      <img src={filterGroupChat?.img} alt="asd" width='200px' className={s.imagen} onClick={handleActiveDialogImg}/>
      {
        activeInput 
        ? <div>
          <form onSubmit={handleSubmit} className={s.groupNameForm}>
            <Input type='text' placeholder={filterGroupChat?.groupName} name='groupName' value={inputNick.groupName} onChange={handleOnChange}/>
            <button type="submit" className={inputNick.groupName !== '' ? s.botonesGroupNameCheck : s.hide}><AiOutlineCheck/></button>
            <button onClick={handleClose} className={s.botonesGroupNameClose}><AiOutlineClose/></button> 
        </form>
        </div>
        : <h2 onClick={handleActive}>{filterGroupChat?.groupName}</h2>
      }
      {filterGroupChat.groupName ? (
        adminsId?.includes(currentUser._id) ? (
          <button onClick={handleClickDialog} className={s.botonAddUsers}>
            <HiOutlineUserAdd className={s.icons} />
            <span>Add Users</span>
          </button>
        ) : (
          ""
        )
      ) : (
        ""
      )}
      {dialog ? (
        <AddUsers
          setDialog={setDialog}
          currentUser={currentUser}
          currentChat={currentChat}
          filterGroupChat={filterGroupChat}
        />
      ) : (
        ""
      )}
      <div>
        <p className={s.usersLength}>
          {filterGroupChat?.chatsUsers.length} users
        </p>
        <div className={s.listOfUsers}>
        {filterGroupChat?.chatsUsers.map((e) => {
          return (
            <div className={s.divUsuarios} key={e._id} onMouseEnter={handleActiveMenu} onMouseLeave={handleNoActiveMenu}>
              <img
                src={e.image}
                alt="asd"
                width="48px"
                className={s.imagenUsuarios}
              />
              <h4 className={s.usersNames}>{e.nickName}</h4>
              <div className={s.divAdmin}>
                <p>{adminsId?.includes(e._id) ? "Admin" : ""}</p>
              </div>
              {/* MODIFICAR EL CODIGO PARA QUE SEA MAS FACIL!!!! */}
              <div>
                {
                  activeMenu 
                  ? <div>
                    { (filterGroupChat?.creator._id !== e._id && e?._id !== currentUser?._id) || adminsId?.includes(currentUser._id) ? 
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<IoIosArrowDown />}
                    className={s.arrowDown}
                  />
                  <MenuList>
                    {filterGroupChat.creator._id === currentUser?._id 
                    ? <div>
                    {
                      adminsId?.includes(e._id) 
                      ? <MenuItem onClick={() => handleRemoveAdmins(e._id)}>Remove Admin</MenuItem> 
                      : <MenuItem onClick={() => handleAdmins(e._id)}>Make Admin</MenuItem>
                    }
                    </div> 
                    : ''}
                    <MenuItem onClick={() => handleRemoveUser(e._id)}>Remove from Group</MenuItem>
                  </MenuList>
                </Menu>
               : (
                ""
              )}
                  </div>
                  : '' 
                }
              </div>
              {
                deleteDialog ? <RemoveUser setDeleteDialog={setDeleteDialog} currentChat={currentChat} filterGroupChat={filterGroupChat} userRemove={ids}/> : ''
              }
              {
                addAdmin ? <Admins setAddAdmin={setAddAdmin} currentChat={currentChat} userRemove={ids}/> : ''
              }
              {
                removeAdmin ? <RemoveAdmins setRemoveAdmin={setRemoveAdmin} currentChat={currentChat} userRemove={ids}/> : ''
              }
              {
                activeDialogImg ? <ChangeImg setActiveDialogImg={setActiveDialogImg} currentChat={currentChat} filterGroupChat={filterGroupChat}/> : ''
              }
            </div>
          );
        })}
        </div>
        <Button color='red' variant='outline' onMouseEnter={handleMouse} onClick={handleLeaveGroup}>Leave Group</Button>
        {
          currentUser._id !== filterGroupChat.creator?._id ? '' : <Button color='red' variant='outline' onClick={handleDeleteGroup}>Delete Group</Button>
        }
      </div>
    </div>
  );
}
