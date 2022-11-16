import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React from 'react';
import s from './Emojis.module.css'
interface Props {
    setMessages: React.Dispatch<React.SetStateAction<{
        textMessage: string;
        messageAuthor: string;
        chatId: string;
    }>>,
    chat: string,
    id: string
}

export default function Emojis ({setMessages, chat,id}:Props){
    const handleEmoji = (e:EmojiClickData)=>{
        setMessages((prevState)=>{
            let msg = {
                chatId: chat,
                messageAuthor: id,
                textMessage: prevState.textMessage + e.emoji
            }
            return msg
        })
    }
    return (
        <div className={s.divEmojis}>
            <EmojiPicker onEmojiClick={(e)=>handleEmoji(e)} />
        </div>
    )
}