import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ImAttachment } from 'react-icons/im'
import { BsFillCameraFill } from 'react-icons/bs'
import { IoMdContact } from 'react-icons/io'
import { AiFillFileText } from 'react-icons/ai'
import { useState } from "react";
import Webcamera from "./camera/Camera";


interface Props {
  setCamera: React.Dispatch<React.SetStateAction<boolean>>
}
export default function IconsMenu({setCamera}: Props){
    const handleCamera = ()=>{
        setCamera(true)
    }
    return(
        <Menu>
  <MenuButton
    as={IconButton}
    aria-label='Options'
    icon={<ImAttachment />}
    backgroundColor= "transparent"
    _hover={{
        background: "transparent",
      }}
    />
  <MenuList>
    <MenuItem onClick={()=>handleCamera()} icon={<BsFillCameraFill />} >
      Camera
    </MenuItem>
    <MenuItem icon={<IoMdContact />} >
      Contact
    </MenuItem>
    <MenuItem icon={<AiFillFileText />}>
      Open File
    </MenuItem>
  </MenuList>
  {/* {cameraStatus && <Webcamera setCameraStatus={setCameraStatus}/>} */}
</Menu>
    )
}