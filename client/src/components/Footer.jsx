import React, { useContext } from 'react'
import '../styles/Footer.css'
import dictionary from '../content'
import LangContext from '../context/lang-context'

export default function Footer(props) {
    const ctxLang = useContext(LangContext);
    const { language } = ctxLang;
    const content = `${dictionary.created[language]} Maciej Konieczny. 2022`
    return (
        <footer className={"Footer mt-5 pt-2 pb-1 ".concat(props.theme)}>
            <h6 className="Footer__author">
                {content}
            </h6>
        </footer>
    )
}
