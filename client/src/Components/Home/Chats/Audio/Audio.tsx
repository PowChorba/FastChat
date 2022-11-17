
import axios from "axios";
import React, { useEffect } from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useAudioRecorder } from 'react-audio-voice-recorder';

interface Props {
    setAudioStatus: React.Dispatch<React.SetStateAction<boolean>>
  }
export default function AudioRecorderTest({setAudioStatus}:Props) {
    const recorderControls = useAudioRecorder()

    const addAudioElement = async(blob:any) => {
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
            console.log(cloudinary.data)
    
          }catch (e) {
            console.log(e)
          }
    };
    useEffect(()=>{
     recorderControls.startRecording()
    },[])

    return (
        <>
            <AudioRecorder recorderControls={recorderControls}  onRecordingComplete={addAudioElement} />
        </>
    );
}