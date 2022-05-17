import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../context/auth-context'
import LangContext from '../context/lang-context'
import dictionary from '../content'
import axios from 'axios'
import DB_HOST from '../DB_HOST'
import PanelButton from './PanelButton'
import { generateLikeText } from '../helpers'

export default function Likebar(props) {
    const ctxAuth = useContext(AuthContext);
    const ctxLang = useContext(LangContext)
    const {itemId, whoLiked} = props;
    const [likes, setLikes] = useState(whoLiked.length)
    const [alreadyLiked, setAlreadyLiked] = useState(whoLiked.includes(ctxAuth.loggedUser))
    const [likeText, setLikeText] = useState(generateLikeText(likes, ctxLang.language))

    useEffect(() => {
        setLikeText(generateLikeText(likes, ctxLang.language))
    }, [likes])

    const handleLikeClick = async () => {
        const getUrl = `${DB_HOST}/api/items/${itemId}`
        const request = await axios.get(getUrl)
        const whoLiked = request.data.likesFrom 
        const goal = whoLiked.includes(ctxAuth.loggedUser) ? 'un' : ''
        const patchUrl = `${DB_HOST}/api/items/${itemId}/${goal}like`
        const body = { payload: ctxAuth.loggedUser }
        await axios.patch(patchUrl, body)
        setLikes(whoLiked.length)
        setAlreadyLiked(whoLiked.includes(ctxAuth.loggedUser))
    }

    return (
        <div className="Likebar">
            <p className="Likebar__likeText me-3">{generateLikeText(likes, ctxLang.language)}</p>
            {ctxAuth.isLoggedIn ? alreadyLiked ? <PanelButton className="fa-solid fa-thumbs-down Likebar__unlikeButton fs-3" text={dictionary.dontlikeit[ctxLang.language]} onClick={handleLikeClick} /> : <PanelButton className="fa-solid fa-thumbs-up Likebar__likeButton fs-3" text={dictionary.likeit[ctxLang.language]} onClick={handleLikeClick} /> : dictionary.loginlike[ctxLang.language]}
        </div>
    )
}
