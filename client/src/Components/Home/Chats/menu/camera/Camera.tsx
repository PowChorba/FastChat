import React, { Component, useCallback, useRef, useState } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react'
import Webcam from "react-webcam";

interface Props {
    setCamera: React.Dispatch<React.SetStateAction<boolean>>
  }

export default function Webcamera({setCamera}:Props) {
    const [image, setImage] = useState('');
    const [imageInfo, setImageInfo] = useState()
    const videoConstraints = {
        width: 220,
        height: 200,
        facingMode: "user"
    };
    const webcamRef: any = useRef(null);

    const capture = useCallback(
        () => {
            const imageSrc : any = webcamRef.current.getScreenshot();
            setImageInfo(imageSrc)
        },

        [webcamRef]
    );

    return (
        <div className="webcam-container">
            <div className="webcam-img">

                {image == '' ?
                    <Webcam
                        audio={false}
                        height={200}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={220}
                        mirrored={true}
                        videoConstraints={videoConstraints}
                    /> : <img src={image} />
                }
                <div style={{display:"flex",justifyContent:"center"}}>
                    {image != '' ?
                        <button onClick={(e) => {
                            e.preventDefault();
                            setImage('')
                        }}
                            className="webcam-btn">
                            Retake Image</button> :
                        <Button onClick={(e) => {
                            e.preventDefault();
                            capture();
                            setCamera(false)
                        }}
                        >Capture</Button>
                    }
                </div>
            </div>
        </div>
    );
}