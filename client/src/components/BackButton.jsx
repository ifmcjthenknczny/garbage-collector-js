import React, { useContext } from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import dictionary from '../content'
import LangContext from '../context/lang-context'

export default function BackButton() {
    const ctxLang = useContext(LangContext)
    const navigate = useNavigate()
    return (
        <Button classname="mt-5 align-self-center justify-self-center" onClick={() => navigate(-1)} content={dictionary.back[ctxLang.language]} />)
}
