import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineSearch } from "react-icons/ai";
import { Messages } from "../../../types";
import { fechasMensajes } from "../Tools/Tools";
import s from './SearchMessages.module.css'

interface Props {
    filterMessages: Messages[]
}

export default function SearchMessages({filterMessages}: Props){
    const [inputText, setInputText] = useState('')

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value)
    }
    const sinDeletedMessages = filterMessages.filter(e => e.textMessage !== 'Message deleted')
    const requireMessage = sinDeletedMessages.filter(e => e.textMessage.toUpperCase().includes(inputText) || e.textMessage.toLowerCase().includes(inputText))

    //PARA LIMPIAR EL TEXTO
    const clearText = () => {
        setInputText('')
    }

    return(
        <div className={s.contenedor}>
            <div className={s.contenedorInput}> 
                <InputGroup>
                    <InputRightElement>
                    {
                        inputText === ''
                        ? <AiOutlineSearch className={s.searchIcon}/>
                        : <AiOutlineArrowLeft className={s.searchIcon} onClick={clearText}/>
                    }    
                    </InputRightElement>
                    <Input type="text" name="inputText" placeholder="Search..." value={inputText} onChange={handleChangeInput}/>   
                </InputGroup>
            </div>
            <div className={s.divContactsMap}>
            {
                inputText !== '' && inputText.length >= 2
                ? <div>
                {
                    requireMessage && requireMessage.map(e => {
                        return(
                            <div key={e._id} className={s.divRequireMessages}>
                                <p>{fechasMensajes(e.createdAt)}</p>
                                <p>{e.textMessage}</p>
                            </div>)
                    })
                }
                </div>
                : <p>Search messages in the chat... </p>
            }
            </div>
        </div>)
}