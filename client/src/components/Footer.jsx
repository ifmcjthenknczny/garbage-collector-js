import React, { useContext } from 'react';
import dictionary from '../content';
import LangContext from '../context/lang-context';
import '../styles/Footer.css';

export default function Footer(props) {
    const ctxLang = useContext(LangContext);

    return (
        <footer className={"Footer mt-5 pt-2 pb-1 ".concat(props.theme)}>
            <h6 className="Footer__author">
                {dictionary.created[ctxLang.language]} Maciej Konieczny. 2022
            </h6>
        </footer>
    )
}
