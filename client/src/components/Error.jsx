import React, { useContext } from 'react'
import LangContext from '../context/lang-context'
import { Link } from 'react-router-dom'
import dictionary from '../content'
import '../styles/Error.css'

export default function Error() {
    const ctxLang = useContext(LangContext)
    return (
        <div className="Error d-flex flex-column align-content-center justify-content-center">
            <h1 className="mt-5 mb-5 pt-2 Error__title">{dictionary.error[ctxLang.language]} 404</h1>
            <Link to="/"><i className="fa-solid fa-circle-exclamation mt-5 mb-5 Error__symbol"></i></Link>
            <span className="mt-5 mb-5 Error__text">{dictionary.lost[ctxLang.language]} <Link className="Link" to="/">{dictionary.home[ctxLang.language]}</Link>?</span>
        </div>
    )
}
