import React, { useContext, useEffect, useState } from 'react'
import LangContext from '../context/lang-context'
import { useParams } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import axios from 'axios'
import dictionary from '../content'
import DB_HOST from '../DB_HOST'
import SearchResult from './SearchResult'

export default function SearchResultsPage() {
  const params = useParams()
  const { query } = params;
  const [searchResults, setSearchResults] = useState([])
  const [loaded, setLoaded] = useState(false)
  const ctxLang = useContext(LangContext);

  useEffect(() => {
    getSearchResults();
  }, [query])

  const getSearchResults = async () => {
    setLoaded(false)
    const url = `${DB_HOST}/api/search/${query}`
    const fetchedResults = await axios.get(url)
    setSearchResults(fetchedResults.data)
    setLoaded(true)
  }

  return (
    <section className="SearchResultsPage">
      {!loaded ? <LoadingSpinner /> : (
        <>
          {searchResults.length !== 0 ? (<>
            <h5 className="SearchResultsPage__success mt-4 text-decoration-underline">{dictionary.searchres[ctxLang.language]} "{query.replaceAll("+", " ")}":</h5>
            {searchResults.map(e => <SearchResult key={e._id} id={e._id} name={e.name} score={e.score} />)}</>) : <h2 className="SearchResultsPage__error mt-3 mb-4 text-decoration-underline">{dictionary.noresults[ctxLang.language]} "{query.replaceAll("+", " ")}".</h2>}
        </>
      )}
    </section>
  )
}
