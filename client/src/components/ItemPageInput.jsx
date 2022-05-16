import React, { useContext, useState } from 'react'
import dictionary from '../content';
import LangContext from '../context/lang-context';
import '../styles/ItemInput.css'
import PanelButton from './PanelButton';

export default function ItemInput(props) {
    const { startName, startValue, clickFunction } = props;
    const [propertyName, setPropertyName] = useState(startName ? startName : "");
    const [propertyValue, setPropertyValue] = useState(startValue ? startValue : "");
    const ctxLang = useContext(LangContext)

    const handleChange = (evt, func) => func(evt.target.value)
    const handleNameChange = (evt) => handleChange(evt, setPropertyName)
    const handleValueChange = (evt) => handleChange(evt, setPropertyValue)
    // const handleRestChange = (evt) => handleChange(evt, setRestValue)

    const handleClick = () => {
        if ([propertyName, propertyValue].includes("")) return
        let body = {};
        body[propertyName] = propertyValue;
        clickFunction(body)
    }

    return (
        <tr className="ItemPageInput text-center">
            <td><input type="text" className="text-center border border-primary rounded" value={propertyName} onChange={handleNameChange} /></td>
            <td><input type="text" className="text-center border border-primary rounded" value={propertyValue} onChange={handleValueChange} /></td>
            <td><div className="buttons"><PanelButton text={dictionary.add[ctxLang.language]} className="fa-solid fa-circle-plus fs-3" onClick={handleClick} /></div></td>
        </tr>
    )
}

