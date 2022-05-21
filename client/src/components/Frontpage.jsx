import React, { useContext } from 'react'
import dictionary from '../content';
import Bestlist from './Bestlist'
import '../styles/Frontpage.css'
import LangContext from '../context/lang-context';
import ThemeContext from '../context/theme-context';
import Tagcloud from './Tagcloud';
import DB_HOST from '../DB_HOST';
import jumbotron from "../images/jumbotron.jpg"

export default function Frontpage(props) {
    const ctxLang = useContext(LangContext);
    const themeClassName = useContext(ThemeContext).isDarkMode ? "dark-theme" : ""
    const { language } = ctxLang;
    const apiLinkCollections = `${DB_HOST}/api/biggest-collections`
    const apiLinkItems = `${DB_HOST}/api/latest-items`

    return (
        <main className="container Frontpage">
            <header className={"Frontpage__header mt-4 mb-5 d-flex flex-column ".concat(props.theme)}>
                <h4 className="Frontpage__welcome">{dictionary.welcome[language]}</h4>
                <h1 className="Frontpage__name fw-bolder">GarbageCollector.js</h1>
            </header>
            <img src={jumbotron} className="img-fluid Frontpage__image" alt="Jumbotron" />
            <div className="Frontpage__content lead mt-5">
                {dictionary.content[language].map(c => <p>{c}</p>)}
            </div>
            <div className="Frontpage__attention-bar mt-5 row">
                <Bestlist header={dictionary.largest[language]} topValueName="items" bottomValueName="author" apiLink={apiLinkCollections} elementLinkTemplate="/collection/" classes="col-4" />
                <Tagcloud classes="col-4" />
                <Bestlist header={dictionary.latest[language]} bottomValueName="added" apiLink={apiLinkItems} elementLinkTemplate="/item/" classes={"col-4 ".concat(themeClassName)} />
            </div>
        </main>
    )
}
