
import axios from "axios";
import React, { useEffect } from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { v4 as uuidv4 } from 'uuid';
import { NEW_MESSAGE } from "../../../../Redux/actions/actions";
import { useAppDispatch } from "../../../../Redux/hooks";
import { CreateMessages } from "../../../../types";
interface Props {
  setAudioStatus: React.Dispatch<React.SetStateAction<boolean>>
  socket: any
  group: string | undefined
  friend: string
  chat: string
  userId: string
}

export default function AudioRecorderTest({ setAudioStatus, socket, group, friend, chat, userId }: Props) {
  const recorderControls = useAudioRecorder()
  const dispatch = useAppDispatch()

  const addAudioElement = async (blob: any) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    try {
      const info = new FormData();
      info.append("resource_type", "video")
      info.append("file", blob);
      info.append("upload_preset", "FastChat")
      setAudioStatus(false)

      const cloudinary = await axios.post('https://api.cloudinary.com/v1_1/powchorba/video/upload', info);

      let cloudinaryUrl:string = cloudinary?.data.secure_url
      let id = uuidv4()

      socket.current.emit('sendMessage', {
        senderId: userId,
        receiverId: friend,
        text: cloudinaryUrl,
        senderChat: chat,
        messageId: id,
        isGroup: group,
        isImage: false,
        isAudio: true
      })
      let messageComplete:CreateMessages = {
        textMessage: cloudinaryUrl,
        messageAuthor: userId,
        chatId: chat,
        isImage: false,
        _id: id,
        isAudio: true
      } 
      dispatch(NEW_MESSAGE(messageComplete))

    } catch (e) {
      console.log(e)
    }
  };
  useEffect(() => {
    // COMIENCE GRABANDO Y SOCKET ESTA GRABANDO UN AUDIO
    recorderControls.startRecording()
    socket.current.emit('sendAudioRecording', {
      senderId: userId,
      receiverId: friend,
      text: "true",
      senderChat: chat
    })
    // SOCKET CUNADO TERMINA DE GRABAR EL AUDIO
    return ()=>{
      socket.current.emit('sendAudioRecording', {
        senderId: userId,
        receiverId: friend,
        text: "",
        senderChat: chat
      })
    }
  }, [socket, chat, friend, recorderControls, userId])

  return (
    <>
      <AudioRecorder recorderControls={recorderControls} onRecordingComplete={addAudioElement} />
    </>
  );
}
