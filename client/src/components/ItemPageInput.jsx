import React, { useContext, useState } from 'react'
import dictionary from '../content';
import LangContext from '../context/lang-context';
import '../styles/ItemPageInput.css'
import PanelButton from './PanelButton';

export default function ItemInput(props) {
    const { startName, startValue, clickFunction, edited } = props;
    const [propertyName, setPropertyName] = useState(startName ? startName : "");
    const [propertyValue, setPropertyValue] = useState(startValue ? startValue : "");
    const [buttonBlock, setButtonBlock] = useState(false)
    const ctxLang = useContext(LangContext)

    const handleChange = (evt, func) => func(evt.target.value)
    const handleNameChange = (evt) => handleChange(evt, setPropertyName)
    const handleValueChange = (evt) => handleChange(evt, setPropertyValue)

    const handleClick = () => {
        if ([propertyName, propertyValue].includes("") || buttonBlock) return
        setButtonBlock(true)
        let body = {};
        body[propertyName] = propertyValue;
        clickFunction(body, edited ? 'edit' : 'add')
        clearInput()
        setButtonBlock(false)
    }

    const clearInput = () => {
        setPropertyName("")
        setPropertyValue("")
    }

    return (
        <tr className="ItemPageInput">
            <td><input type="text" className="border border-primary rounded" value={propertyName} onChange={handleNameChange} placeholder={dictionary.propname[ctxLang.language]} /></td>
            <td><input type="text" className="border border-primary rounded" value={propertyValue} onChange={handleValueChange} placeholder={dictionary.propval[ctxLang.language]} /></td>
            <td><div className="buttons"><PanelButton text={edited ? dictionary.confirm[ctxLang.language] : dictionary.add[ctxLang.language]} className={"fa-solid fs-5 fa-circle-".concat(edited ? "check" : "plus")} onClick={handleClick} /></div></td>
        </tr>
    )
}

