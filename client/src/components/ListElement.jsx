import React, {useContext} from 'react'
import '../styles/BestlistElement.css';
import { Link } from 'react-router-dom';
import LangContext from '../context/lang-context';
import {hasNumber} from '../helpers'
import dictionary from '../content'

export default function BestlistElement(props) {
    const { id, name, bottomValue, topValue, urlTemplate, isDarkMode, classes } = props;
    const linkUrl = `${urlTemplate}${id}`
    const themeClassName = isDarkMode ? "dark-theme" : ""
    const ctxLang = useContext(LangContext)
    return (
        <li className={"list-group-item d-flex justify-content-between align-items-start BestlistElement ".concat(themeClassName)}>
            <div className="ms-2 BestlistElement__content d-flex flex-column justify-content-center">
                <h6 className="fw-bold BestlistElement__name">
                    <Link className="Link--bestlist" to={linkUrl}>{name}</Link>
                </h6>
                {bottomValue ? <span className="BestlistElement__bottomValue">
                    {hasNumber(bottomValue) ? new Date(bottomValue).toLocaleString(ctxLang.language) : <Link className="Link--bestlist" to={"/user/".concat(bottomValue)}>{dictionary.byuser[ctxLang.language].concat(" ", bottomValue)}</Link>}
                </span>: ""}
            </div>
            {topValue ? <span className="badge bg-primary rounded-pill BestlistElement__topValue ms-3">
                {topValue}
            </span> : ""}
        </li>
    )
}
