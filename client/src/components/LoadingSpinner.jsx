import React, {useContext} from 'react'
import LangContext from '../context/lang-context'
import dictionary from '../content'

export default function LoadingSpinner() {
    const ctxLang = useContext(LangContext)
  return (
    <div className="spinner-border fs-1" role="status">
        <span className="visually-hidden">{dictionary.loading[ctxLang.language]}</span>
      </div>
  )
}
