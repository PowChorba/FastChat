import axios from 'axios'
import { useState } from 'react'
import { Recorder } from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'

interface Props {
  setAudioStatus: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Audio({setAudioStatus}:Props) {
  const [audioDetails, setAudioDetails] = useState({
    url: null,
    blob: null,
    chunks: null,
    duration: {
      h: 0,
      m: 0,
      s: 0
    }
  })

  const handleAudioStop = async (data: any) => {
    console.log("Blob", data.blob)
    setAudioDetails(data);
    try {
        const info = new FormData();
        info.append("resource_type", "video")
        info.append("file", data.blob);
        info.append("upload_preset", "FastChat")
        const cloudinary = await axios.post('https://api.cloudinary.com/v1_1/powchorba/video/upload', info);
        console.log(cloudinary.data)

      }catch (e) {
        console.log(e)
      }
    }
    
    function handleAudioUpload(file: any) {
      // console.log(file);
    }

    function handleCountDown(data: any) {
      // console.log(data);
    }

    function handleReset() {
      const reset = {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: 0,
          m: 0,
          s: 0
        }
      };
      // this.setState({ audioDetails: reset });
      setAudioDetails(reset)
    }

    return (
      <>
        <Recorder
          record={true}
          hideHeader={true}
          audioURL={audioDetails.url}
          showUIAudio
          handleAudioStop={(data: any) => handleAudioStop(data)}
          handleAudioUpload={(file: any) => handleAudioUpload(file)}
          handleCountDown={(data: any) => handleCountDown(data)}
          handleReset={() => handleReset()}
          mimeTypeToUseWhenRecording={`audio/webm`} // For specific mimetype.
        />
        {audioDetails.url && <audio src={audioDetails.url} autoPlay />}
      </>
    )
  }