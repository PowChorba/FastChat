import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineSearch } from "react-icons/ai";
import s from './SearchMessages.module.css'

export default function SearchMessages(){
    const [inputText, setInputText] = useState('')
    
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value)
    }

    //PARA LIMPIAR EL TEXTO
    const clearText = () => {
        setInputText('')
    }

    return(
        <div>
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
        </div>)
}