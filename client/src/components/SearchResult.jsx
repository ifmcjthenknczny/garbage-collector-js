import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import dictionary from '../content';
import LangContext from '../context/lang-context'
import '../styles/SearchResult.css'

export default function SearchResult(props) {
    const { id, name, score } = props;
    const ctxLang = useContext(LangContext);
    let scoreShow = score.toString().slice(0, 4)
    if (ctxLang.language === 'pl') scoreShow = scoreShow.replace('.', ',')
    return (
        <li key={id} className="SearchResult d-flex flex-column p-3 m-3 border-1 rounded">
            <div className="SearchResult__container d-flex flex-column">
                <h3>
                    <Link className="Link--search" to={"/item/".concat(id)}>{name}</Link>
                </h3>
                <h6>{dictionary.score[ctxLang.language]}: {scoreShow}</h6>
            </div>
        </li>
    )
}