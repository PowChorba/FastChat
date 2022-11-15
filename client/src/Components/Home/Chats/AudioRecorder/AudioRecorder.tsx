import { useState } from 'react'
import {Recorder} from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'

export default function Audio(){
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
   
    function handleAudioStop(data:any){
        console.log(data.blob)
        // setAudioDetails({ audioDetails: data });
        setAudioDetails(data);
    }
    
    function handleAudioUpload(file:any) {
        console.log(file);
    }
    
    function handleCountDown(data:any) {
        console.log(data);
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
    
      return(
        <>
          <Recorder
              record={true}
              // title={"New recording"}
              hideHeader={true}
              audioURL={audioDetails.url}
              showUIAudio
              handleAudioStop={(data: any) => handleAudioStop(data)}
              handleAudioUpload={(file: any) => handleAudioUpload(file)}
              handleCountDown={(data: any) => handleCountDown(data)}
              handleReset={() => handleReset()}
              mimeTypeToUseWhenRecording={`audio/webm`} // For specific mimetype.
              />
              {audioDetails.url && <audio src={audioDetails.url} autoPlay/>}
              {audioDetails.url && <p>Hola</p>}
              </>
    )
}