import React, { useContext, useEffect, useState } from 'react'
import LangContext from '../context/lang-context'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import axios from 'axios'
import dictionary from '../content'
import DB_HOST from '../DB_HOST'

export default function SearchResultsPage() {
  const ctxLang = useContext(LangContext);
  const params = useParams()
  const { query } = params;

  const [searchResults, setSearchResults] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getSearchResults();
  }, [query])

  const getSearchResults = async () => {
    const url = `${DB_HOST}/api/search/${query}`
    console.log(url)
    const fetchedResults = await axios.get(url)
    setSearchResults(fetchedResults.data)
    setLoaded(true)
  }

  return (
    <section className="SearchResultsPage d-flex flex-column">
      {!loaded ? <LoadingSpinner /> : (
        <>
          {searchResults.length !== 0 ? (<><h2 className="SearchResultsPage__success mt-3 mb-4">{dictionary.searchres[ctxLang.language]}:</h2>{searchResults.map(e => <div key={e._id} className="SearchResultsPage__result p-3 m-3 border-1 rounded bg-primary text-white"><Link className="Link--search" to={"/item/".concat(e._id)}>{e.name}</Link></div>)}</>) : <h2 className="SearchResultsPage__error mt-3 mb-4">{dictionary.noresults[ctxLang.language]}</h2>}
        </>
      )}
    </section>
  )
}
