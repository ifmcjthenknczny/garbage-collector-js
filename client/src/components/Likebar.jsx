import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import dictionary from '../content'
import AuthContext from '../context/auth-context'
import LangContext from '../context/lang-context'
import DB_HOST from '../DB_HOST'
import { generateLikeText } from '../helpers'
import '../styles/Likebar.css'
import PanelButton from './PanelButton'

export default function Likebar(props) {
    const { itemId, whoLiked } = props;

    const ctxAuth = useContext(AuthContext);
    const ctxLang = useContext(LangContext);

    const [alreadyLiked, setAlreadyLiked] = useState(whoLiked.includes(ctxAuth.loggedUser))
    const [blockButton, setBlockButton] = useState(false)
    const [likes, setLikes] = useState(whoLiked.length)
    const [likeText, setLikeText] = useState(generateLikeText(likes, ctxLang.language))

    useEffect(() => {
        setLikeText(generateLikeText(likes, ctxLang.language))
    }, [likes, ctxLang.language, itemId])

    const handleLikeClick = async () => {
        if (blockButton) return
        setBlockButton(true)
        const goal = alreadyLiked ? 'un' : ''
        const diff = goal.length === 0 ? 1 : -1
        const patchUrl = `${DB_HOST}/api/items/${itemId}/${goal}like`
        const body = { payload: ctxAuth.loggedUser }
        setLikes(prev => prev + diff)
        setAlreadyLiked(!alreadyLiked)
        await axios.patch(patchUrl, body)
        setBlockButton(false)
    }

    return (
        <div className="Likebar">
            <p className="Likebar__likeText me-3">{likeText}</p>
            {ctxAuth.isLoggedIn ? alreadyLiked ? <PanelButton className="fa-solid fa-thumbs-down Likebar__unlikeButton fs-3" text={dictionary.dontlikeit[ctxLang.language]} onClick={handleLikeClick} /> : <PanelButton className="fa-solid fa-thumbs-up Likebar__likeButton fs-3" text={dictionary.likeit[ctxLang.language]} onClick={handleLikeClick} /> : dictionary.loginlike[ctxLang.language]}
        </div>
    )
}
