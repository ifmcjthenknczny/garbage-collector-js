import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import dictionary from '../content'
import LangContext from '../context/lang-context'
import DB_HOST from '../DB_HOST'
import '../styles/Tagcloud.css'

export default function Tagcloud(props) {
  const { classes } = props;
  const ctxLang = useContext(LangContext)
  const [tags, setTags] = useState([])

  useEffect(() => {
    getTags();
  }, [])

  const getTags = async () => {
    const url = `${DB_HOST}/api/tags`
    const data = await axios.get(url)
    setTags(data.data)
  }

  return (
    <section className={"Tagcloud ".concat(classes)}>
      <h4 className="Tagcloud__title">{dictionary.tagcloud[ctxLang.language]}</h4>
      <div className="Tagcloud__tags">
        {tags ? tags.map(t => <Link key={t} className="Link--tagcloud" to={"/search/".concat(t.trim().replaceAll(" ", "+"))}>{t.concat(" ")}</Link>) : ""}
      </div>
    </section>
  )
}
