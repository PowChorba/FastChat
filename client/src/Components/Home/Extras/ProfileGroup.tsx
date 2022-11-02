import { useState } from "react";
import { Chats, User } from "../../../types";
import AddUsers from "../Chats/AddUsers";
import s from "./ChatProfile.module.css";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import RemoveUser from "./RemoveUser";
import Admins from "../Dialogs/Admins";
import RemoveAdmins from "../Dialogs/RemoveAdmin";

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

  //PROPIEDADES PARA AGERGAR USUARIOS AL CHAT
  const [dialog, setDialog] = useState(false);
  
  const handleClickDialog = () => {
    setDialog(!dialog);
  };

  //PROPIEDADES PARA ELEIMINAR USUARIOS DEL CHAT
  const [deleteDialog, setDeleteDialog] = useState(false)

  const handleRemoveUser = () => {
    setDeleteDialog(!deleteDialog)
  }

  //PROPIEDADES PARA AGREGAR ADMINS
  const [addAdmin, setAddAdmin] = useState(false)

  const handleAdmins = () => {
    setAddAdmin(!addAdmin)

  }

  //PROPIEDADES PARA ELIMINAR ADMINS
  const [removeAdmin, setRemoveAdmin] = useState(false)

  const handleRemoveAdmins = () => {
    setRemoveAdmin(!removeAdmin)
  }

  return (
    <div className={s.contenedor}>
      <img
        src={filterGroupChat?.img}
        alt="asd"
        width="250px"
        className={s.imagen}
      />
      <h4>{filterGroupChat?.groupName}</h4>
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
            <div className={s.divUsuarios}>
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
              {/* <button className={s.arrowDown}><span><IoIosArrowDown/></span></button> */}
              {adminsId?.includes(currentUser._id) ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<IoIosArrowDown />}
                    className={s.arrowDown}
                  />
                  <MenuList>
                    {adminsId?.includes(e._id) ? <MenuItem onClick={handleRemoveAdmins}>Remove Admin</MenuItem> : <MenuItem onClick={handleAdmins}>Make Admin</MenuItem>}
                    <MenuItem onClick={handleRemoveUser}>Remove from Group</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                ""
              )}
              {
                deleteDialog ? <RemoveUser setDeleteDialog={setDeleteDialog} currentChat={currentChat} filterGroupChat={filterGroupChat} userRemove={e}/> : ''
              }
              {
                addAdmin ? <Admins setAddAdmin={setAddAdmin} currentChat={currentChat} userRemove={e}/> : ''
              }
              {
                removeAdmin ? <RemoveAdmins setRemoveAdmin={setRemoveAdmin} currentChat={currentChat} userRemove={e}/> : ''
              }
            </div>
          );
        })}
        </div>
        <Button color='red' variant='outline'>Leave Group</Button>
      </div>
    </div>
  );
}
