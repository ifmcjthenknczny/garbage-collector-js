import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import dictionary from '../content';
import LangContext from '../context/lang-context';
import { hasNumber } from '../helpers';
import '../styles/ListElement.css';

export default function ListElement(props) {
    const { bottomValue, id, isDarkMode, name, topValue, urlTemplate } = props;
    const ctxLang = useContext(LangContext)

    const linkUrl = `${urlTemplate}${id}`
    const themeClassName = isDarkMode ? "dark-theme" : ""

    return (
        <li className={"list-group-item d-flex justify-content-between align-items-start ListElement ".concat(themeClassName)}>
            <div className="ms-2 ListElement__content d-flex flex-column justify-content-center">
                <h6 className="fw-bold ListElement__name">
                    <Link className="Link--bestlist" to={linkUrl}>{name}</Link>
                </h6>
                {bottomValue ? <span className="ListElement__bottomValue">
                    {hasNumber(bottomValue) ? new Date(bottomValue).toLocaleString(ctxLang.language) : <Link className="Link--bestlist" to={"/user/".concat(bottomValue)}>{dictionary.byuser[ctxLang.language].concat(" ", bottomValue)}</Link>}
                </span> : ""}
            </div>
            {topValue ? <span className="badge bg-primary rounded-pill ListElement__topValue ms-3">
                {topValue}
            </span> : ""}
        </li>
    )
}
