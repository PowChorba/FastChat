import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ImAttachment } from 'react-icons/im'
import { BsFillCameraFill } from 'react-icons/bs'
import { IoMdContact } from 'react-icons/io'
import { AiFillFileText } from 'react-icons/ai'
import { useState } from "react";
// import Webcamera from "./camera/Camera";
import OpenCamera from "../../Dialogs/OpenCamera";
import { CreateMessages, User } from "../../../../types";


interface Props {
  setCameraStatus: React.Dispatch<React.SetStateAction<boolean>>
  setMessages: React.Dispatch<React.SetStateAction<CreateMessages>>
  messages: CreateMessages
  currentChat: string
  currentUser: User
  submit: (e: React.FormEvent<HTMLFormElement>) => void
}
export default function IconsMenu({ currentChat, currentUser, setMessages, messages, submit}: Props){
    const [openCam, setOpenCam] = useState(false)

    const handleCamera = () => {
      setOpenCam(!openCam)
    }
    return(
        <Menu>
  <MenuButton><ImAttachment/></MenuButton>
  <MenuList>
    <MenuItem onClick={handleCamera} icon={<BsFillCameraFill />} >
      Camera
    </MenuItem>
    <MenuItem icon={<IoMdContact />} >
      Contact
    </MenuItem>
    <MenuItem icon={<AiFillFileText />}>
      Open File
    </MenuItem>
  </MenuList>
  {
    openCam ? <OpenCamera setOpenCam={setOpenCam} currentChat={currentChat} currentUser={currentUser} setMessages={setMessages} messages={messages}/> : ''
  }
</Menu>
    )
}