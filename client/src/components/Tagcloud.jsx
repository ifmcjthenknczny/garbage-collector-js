import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DB_HOST from '../DB_HOST'
import '../styles/Tagcloud.css'
import dictionary from '../content'
import LangContext from '../context/lang-context'
import { Link } from 'react-router-dom'

export default function Tagcloud(props) {
  const { classes } = props;
  const [tags, setTags] = useState([])
  const ctxLang = useContext(LangContext)
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
