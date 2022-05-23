import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import gfm from 'remark-gfm';
import dictionary from '../content';
import LangContext from '../context/lang-context';

export default function Collection(props) {
    const { checkboxEvent, description, editable, id, items, name, topic } = props;
    const ctxLang = useContext(LangContext);

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
            <td><ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown></td>
            <td>{items}</td>
        </tr>
    )
}