import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, {Dispatch, SetStateAction} from 'react';

interface Props {
    setMessages: React.Dispatch<React.SetStateAction<{
        textMessage: string;
        messageAuthor: string;
        chatId: string;
    }>>,
    handleMessage: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Emojis ({setMessages, handleMessage}:Props){
    const handleEmoji = (e:EmojiClickData)=>{
        setMessages((prevState)=>{
            let msg = {
                chatId: prevState.chatId,
                messageAuthor: prevState.messageAuthor,
                textMessage: prevState.textMessage + e.emoji
            }
            return msg
        })
    }
    return (
        <>
        <EmojiPicker onEmojiClick={(e)=>handleEmoji(e)} />
        </>
    )
}