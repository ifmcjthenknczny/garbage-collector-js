import React from 'react'
import { Link } from 'react-router-dom'

export default function Item(props) {
    const { checkboxEvent, editable, id, name, tags } = props;
    
    const handleCheck = () => {
        checkboxEvent(id);
    }

    return (
        <tr className="Item">
            {editable ?
                <td><div className="form-check">
                    <input className="form-check-input" onClick={handleCheck} type="checkbox" />
                </div></td> : ""}
            <td><Link to={`/item/${id}`} className="Link">{name}</Link></td>
            <td>{tags.join(', ')}</td>
        </tr>
    )
}