import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useEffect, useRef } from 'react';
import s from './Emojis.module.css'
interface Props {
    setMessages: React.Dispatch<React.SetStateAction<{
        textMessage: string;
        messageAuthor: string;
        chatId: string;
    }>>,
    chat: string,
    id: string,
    scroll: React.RefObject<HTMLDivElement>
}

export default function Emojis ({setMessages, chat, id, scroll}:Props){
    // const scroll = useRef<HTMLDivElement>(null)

    // useEffect(() => {
    //     scroll.current?.scrollIntoView(false)
    // },[])

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
        <div ref={scroll} className={s.divEmojis}>
            <EmojiPicker width={"100%"} onEmojiClick={(e)=>handleEmoji(e)} />
        </div>
    )
}