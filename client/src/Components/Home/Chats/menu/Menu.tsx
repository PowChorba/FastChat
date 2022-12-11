import { Input, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsFillCameraFill } from 'react-icons/bs'
import { AiFillFileText } from 'react-icons/ai'
import { useState } from "react";
import OpenCamera from "../../Dialogs/OpenCamera";
import { CreateMessages, User } from "../../../../types";
import s from './IconsMenu.module.css'
import axios from "axios";
import {BiLinkAlt} from "react-icons/bi"
interface Props {
  setMessages: React.Dispatch<React.SetStateAction<CreateMessages>>
  messages: CreateMessages
  currentChat: string
  currentUser: User
}
export default function IconsMenu({ currentChat, currentUser, setMessages, messages }: Props) {
  const [openCam, setOpenCam] = useState(false)

  const handleCamera = () => {
    setOpenCam(!openCam)
  }

  //PARA PODER MODIFICAR LA IMAGEN
  const handleImage = async (e: any) => {
    try {
      const file = e.target.files[0];
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "FastChat");

      const cloudinary = await axios.post('https://api.cloudinary.com/v1_1/powchorba/image/upload', data);

      setMessages({
        messageAuthor: currentUser?._id,
        chatId: currentChat,
        textMessage: cloudinary.data?.secure_url,
        isImage: true
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton>{isOpen ? <BiLinkAlt size="1.5em" color="#008069" /> : <BiLinkAlt size="1.5em" />}</MenuButton>
          <MenuList>
            <MenuItem onClick={handleCamera} icon={<BsFillCameraFill />} >
              Camera
            </MenuItem>
            <label htmlFor="openFile">
              <div className={s.divOpenFile}><AiFillFileText className={s.fillFile} /> Open file</div>
              <Input id="openFile" type="file" accept="image/jpeg, image/png" name="image" onChange={handleImage} className={s.displayNone} />
            </label>
          </MenuList>
          {
            openCam ? <OpenCamera setOpenCam={setOpenCam} currentChat={currentChat} currentUser={currentUser} setMessages={setMessages} messages={messages} /> : ''
          }

        </>
      )}
    </Menu>
  )
}