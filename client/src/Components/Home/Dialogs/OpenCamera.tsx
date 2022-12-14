import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  AlertDialogHeader,
} from "@chakra-ui/react";
import axios from "axios";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { CreateMessages, User } from "../../../types";
import s from "./ChangeImg.module.css";

interface Props {
  setOpenCam: Dispatch<SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<CreateMessages>>
  messages: CreateMessages
  currentChat: string
  currentUser: User
}

export default function OpenCamera({ setOpenCam, currentChat, currentUser, setMessages, messages }: Props) {
  const [open, setOpen] = useState(true);
  const cancelRef: any = useRef();
  const [image, setImage] = useState("");

  const videoConstraints = {
    width: 750,
    height: 600,
    facingMode: "user",
  };
  const webcamRef: any = useRef(null);

  const capture = useCallback(() => {
    const imageSrc: any = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);


  //PARA PODER MODIFICAR LA IMAGEN
  const handleImage = async (e: any) => {
    try {
      const file = e;
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
      setOpenCam(false)
    } catch (error) {
      console.log(error);
    }
  };

  const capturePhoto = () => {
    capture();
  }


  const retakePhoto = () => {
    setImage('')
  }

  const onClose = () => {
    setOpen(false);
    setOpenCam(false);
  };

  return (
    <>
      <AlertDialog
        isOpen={open}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              className={s.dialogHeader}
              fontSize="lg"
              fontWeight="bold"
            >
              <span ref={cancelRef} onClick={onClose} className={s.closeDialog}>
                X
              </span>
              Change Profile Photo
            </AlertDialogHeader>
            <AlertDialogBody>
              <div>
                {image === "" ? (
                  <Webcam
                    audio={false}
                    height={100}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1000}
                    mirrored={true}
                    videoConstraints={videoConstraints}
                  />
                ) : (
                  <img src={image} alt="asd" />
                )}
              </div>
            </AlertDialogBody>
            <AlertDialogFooter className={s.footer}>
              {
                image === ''
                  ? <Button colorScheme="teal" ml={3} variant="outline" onClick={() => capturePhoto()}>Capture Photo</Button>
                  : <div>
                    <Button colorScheme="teal" ml={3} variant="outline" onClick={retakePhoto}>Retake Photo</Button>
                    <Button type="submit" onClick={() => handleImage(image)} colorScheme="teal" ml={3} variant="outline">Send Photo</Button>
                  </div>
              }
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
