import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import dictionary from '../content'
import AuthContext from '../context/auth-context'
import LangContext from '../context/lang-context'
import ThemeContext from '../context/theme-context'
import en from '../images/en.png'
import pl from '../images/pl.png'
import '../styles/Topbar.css'
import Button from './Button'
import Searchbar from './Searchbar'

export default function Topbar(props) {
    const ctxAuth = useContext(AuthContext);
    const ctxTheme = useContext(ThemeContext);
    const ctxLang = useContext(LangContext);
    const { language } = ctxLang;

    const navigate = useNavigate();
    const location = useLocation().pathname;

    const searchPlaceholder = dictionary.search[language]

    return (
        <header className={"Topbar row justify-content-center ".concat(props.theme)}>
            <div className="Topbar__top d-flex flex-md-row flex-column m-3 mt-md-0 pt-2 justify-content-evenly align-items-center">
                <div className="button-container m-2 button-container--login d-flex justify-content-evenly">
                    {ctxAuth.isLoggedIn ? <Link to="/"><Button className="button--logout btn-danger btn" content={dictionary.logout[language]} onClick={ctxAuth.onLogout} /></Link> : <Link to="/login"><Button className="button--login btn btn-success" content={dictionary.login[language]} /></Link>
                    }
                    <Link to="/register">
                        <Button className="button--register" content={dictionary.register[language]} />
                    </Link>
                </div>
                <Searchbar placeholder={searchPlaceholder} classes="order-5 order-md-0" />
                <div className="button-container m-2 button-container--options d-flex justify-content-evenly">
                    <Button className="button--theme" onClick={ctxTheme.toggleTheme} content={ctxTheme.isDarkMode ?
                        <i className="fa-solid fa-sun align-self-center" /> :
                        <i className="fa-solid fa-moon align-self-center" />} />
                    <Button className="button--language" onClick={ctxLang.toggleLanguage} content={<img className="img-thumbnail" src={language === 'pl' ? en : pl} alt={dictionary.lang[language]} />} />
                </div>
            </div>
            <div className="Topbar__bottom mb-md-4 mb-2 d-flex flex-column flex-md-row justify-content-evenly align-items-center">
                {ctxAuth.isAdmin ? <button className="btn btn-danger mt-md-0 m-2 align-self-center order-md-0 order-5" onClick={() => navigate('/admin')}>{dictionary.adminpanel[ctxLang.language]}</button> : ""}
                {location !== "/" ? <div className="Logo align-self-center mt-md-0 mt-2" onClick={() => navigate('/')}><h2>GarbageCollector.js</h2></div> : ""}
                {ctxAuth.isLoggedIn ? <span className="Topbar__loggedUser mt-md-0 mb-2">{dictionary.loggedas[ctxLang.language]} <Link className="Link" to={"/user/".concat(ctxAuth.loggedUser)}>{ctxAuth.loggedUser}</Link></span> : ""}
            </div>
        </header>
    )
}
