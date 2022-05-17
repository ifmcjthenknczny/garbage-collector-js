import React, { useContext, useState } from 'react'
import '../styles/Login.css'
import { validateEmail } from '../helpers'
import axios from 'axios'
import AuthContext from '../context/auth-context'
import LangContext from '../context/lang-context'
import dictionary from '../content'
import { useNavigate } from "react-router-dom";
import DB_HOST from '../DB_HOST'

export default function Login(props) {
    const { loginWindow } = props;
    const [username, setUsername] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState('');
    const ctxAuth = useContext(AuthContext);
    const ctxLang = useContext(LangContext);
    const navigate = useNavigate();

    const handleInputUsername = (evt) => setUsername(evt.target.value)
    const handleInputMail = (evt) => setMail(evt.target.value)
    const handleInputPassword = (evt) => setPassword(evt.target.value)

    // połączyć obydwie funkcje w handleClick

    const handleClick = async (evt) => {
        evt.preventDefault();
        if (username.trim().length === 0) {
            setAlert(dictionary.enteruser[ctxLang.language])
            return
        }
        if (username.includes('@') || username.includes(" ")) {
            setAlert(dictionary.charnotallowed[ctxLang.language])
            return
        }
        if (!validateEmail(mail) && !loginWindow) {
            setAlert(dictionary.validmail[ctxLang.language])
            return
        }
        if (password.trim().length === 0) {
            setAlert(dictionary.enterpass[ctxLang.language])
            return
        }

        let exists = false;
        await axios.get(`${DB_HOST}/api/users/${username}`).then((res) => { if (!!res.data) { exists = true; } })
        // await axios.get(`${DB_HOST}/api/users/${mail}`, {}).then((res) => { if (!!res.data) { exists = true; setAlert(dictionary.userexists[ctxLang.language]) } })
        if (!loginWindow && exists) { setAlert(dictionary.userexists[ctxLang.language]); return; }
        else if (loginWindow && !exists) { setAlert(dictionary.usernotexists[ctxLang.language]); return; }
        let navigateAddress = '';

        if (!loginWindow) {
            const user = {
                username: username,
                email: mail,
                lastLogin: null,
                registrationTime: Date.now(),
                isActive: true,
                isAdmin: false,
                password: password
            }
            await axios.post(`${DB_HOST}/api/users/`, user);
            setAlert(`${dictionary.successreg[ctxLang.language]}${username}!`)
            navigateAddress = '/login'
        } else {
            let dbPass = '';
            let isActive = true;
            let isAdmin = false;
            await axios.get(`${DB_HOST}/api/users/${username}`).then(res => { dbPass = res.data.password; isActive = res.data.isActive; isAdmin = res.data.isAdmin })
            if (!isActive) {
                setAlert(dictionary.userblock[ctxLang.language])
                return
            }
            if (isAdmin) ctxAuth.onAdmin();
            if (password !== dbPass) {
                setAlert(dictionary.userpassmatch[ctxLang.language])
                return
            }
            const loginUrl = `${DB_HOST}/api/users/${username}`;
            await axios.patch(loginUrl, { lastLogin: Date.now() });
            ctxAuth.onLogin(username);
            navigateAddress = `/user/${username}`
        }
        // setTimeout(navigate(navigateAddress), 2000)
        navigate(-1)
    }

    const handleFocus = (evt) => {
        setAlert('');
    }

    return (<div className="Login border rounded d-flex flex-column mt-2 p-2" >
        <input type="text" id="username" className="username" placeholder={dictionary.username[ctxLang.language]} onFocus={handleFocus} onInput={handleInputUsername} />
        {!loginWindow ? <input type="text" id="email" className="email" placeholder={dictionary.mail[ctxLang.language]} onFocus={handleFocus} onInput={handleInputMail} /> : ''}
        <input type="password" id="password" className="password" placeholder={dictionary.password[ctxLang.language]} onFocus={handleFocus} onInput={handleInputPassword} />
        <button className="button__submit btn btn-dark rounded align-self-center mt-1" type="submit" onClick={handleClick}>
            {loginWindow ? dictionary.logme[ctxLang.language] : dictionary.registerme[ctxLang.language]}!
        </button>
        <span className="Login__alert fs-3 mb-2 mt-2">{alert}</span>
    </div>)
}