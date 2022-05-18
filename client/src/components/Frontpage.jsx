import React, { useContext } from 'react'
import dictionary from '../content';
import Bestlist from './Bestlist'
import '../styles/Frontpage.css'
import LangContext from '../context/lang-context';
import Tagcloud from './Tagcloud';
import DB_HOST from '../DB_HOST'

export default function Frontpage() {
    const ctxLang = useContext(LangContext);
    const { language } = ctxLang;
    const apiLinkCollections = `${DB_HOST}/api/collections/biggest`
    const apiLinkItems = `${DB_HOST}/api/items/latest`

    return (
        <main className="container">
            <div className="Main__jumbotron mt-5 mb-5">
                <h1 className="Main__title">{dictionary.welcome[language]} <span className="Main__title-name fw-bolder fst-italic">GarbageCollector.js</span></h1>
            </div>
            <div className="Main__content lead">
                {dictionary.content[language].map(c => <p>{c}</p>)}
            </div>
            <div className="Main__attention-bar d-flex justify-content-around mt-5">
                {/* <Bestlist header={dictionary.largest[language]} topValueName="items" apiLink={apiLinkCollections} /> */}
                {/* <Bestlist header={dictionary.latest[language]} bottomValueName="added" apiLink={apiLinkItems} /> */}
            </div>
            <Tagcloud />
        </main>
    )
}
