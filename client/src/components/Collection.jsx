import React, {useContext, useEffect} from 'react'
import { Link } from 'react-router-dom';
import LangContext from '../context/lang-context';
import dictionary from '../content';

export default function Collection(props) {
    const { checkboxEvent, name, description, topic, editable, id, items } = props;
    const ctxLang = useContext(LangContext)
    
    const handleCheck = () => {
        checkboxEvent(id);
    }

    return (
        <tr className="Collection">
            {editable ?
                <td><div className="form-check">
                    <input className="form-check-input" onClick={handleCheck} type="checkbox" />
                </div></td> : ""}
            <td><Link to={`/collection/${id}`} className="Link">{name}</Link></td>
            <td>{dictionary[topic][ctxLang.language]}</td>
            <td>{description}</td>
            <td>{items}</td>
        </tr>
    )
}