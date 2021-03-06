import React, { useContext } from 'react';
import dictionary from '../content';
import LangContext from '../context/lang-context';
import PanelButton from './PanelButton';

export default function ItemProperty(props) {
    const { deleteFunction, editable, editFunction, name, value } = props;

    const ctxLang = useContext(LangContext)

    const handleDeleteProperty = () => {
        deleteFunction({ [name]: value })
    }

    const handleEditProperty = () => {
        editFunction({ [name]: value })
    }

    return (
        <tr>
            <td>{name}:</td>
            <td>{value}</td>
            <td>
                {editable ? <div className="ItemProperty__buttons d-flex align-items-center flex-row">
                    <PanelButton text={dictionary.edit[ctxLang.language]} className="fa-solid fa-gear fs-5" onClick={handleEditProperty} />
                    <PanelButton text={dictionary.delete[ctxLang.language]} className="ms-2 fa-solid fa-trash-can fs-5 text-danger" onClick={handleDeleteProperty} />
                </div> : ""}
            </td>
        </tr>
    )
}
