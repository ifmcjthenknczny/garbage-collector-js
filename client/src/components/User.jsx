import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import dictionary from '../content';
import LangContext from '../context/lang-context';
import '../styles/User.css';

export default function User(props) {
    let { checkboxEvent, email, isAdmin, lastlogin, name, regtime, status } = props;
    const ctxLang = useContext(LangContext)

    if (lastlogin === null) {
        lastlogin = dictionary.never[ctxLang.language]
    } else {
        lastlogin = new Date(lastlogin).toLocaleString(ctxLang.language)
    }
    regtime = new Date(regtime).toLocaleString(ctxLang.language)

    const handleCheck = () => {
        checkboxEvent(name);
    }

    return (
        <tr className="User text-center">
            <td><div className="form-check">
                <input className="form-check-input" onClick={handleCheck} type="checkbox" />
            </div></td>
            <td><Link className="Link" to={`/user/${name}`}>{name}</Link></td>
            <td>{email}</td>
            <td>{lastlogin}</td>
            <td>{regtime}</td>
            <td>{status}</td>
            <td>{isAdmin ? dictionary.yes[ctxLang.language] : dictionary.no[ctxLang.language]}</td>
        </tr>
    )
}