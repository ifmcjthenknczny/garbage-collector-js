import React, {useContext, useEffect} from 'react'
import { Link } from 'react-router-dom';
import LangContext from '../context/lang-context';
import ThemeContext from '../context/theme-context'

export default function Collection(props) {
    const { checkboxEvent, name, description, topic, imageLink, editable, id, items, created } = props;
    const ctxLang = useContext(LangContext)
    // const ctxTheme = useContext(ThemeContext)

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
            <td>{topic}</td>
            <td>{description}</td>
            <td>{items}</td>
        </tr>
    )
}