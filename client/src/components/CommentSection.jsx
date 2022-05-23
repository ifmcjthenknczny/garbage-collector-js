import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import dictionary from '../content'
import AuthContext from '../context/auth-context'
import LangContext from '../context/lang-context'
import DB_HOST from '../DB_HOST'
import '../styles/CommentSection.css'
import Comment from './Comment'
import LoadingSpinner from './LoadingSpinner'

export default function CommentSection(props) {
  const { itemId } = props;

  const ctxAuth = useContext(AuthContext)
  const ctxLang = useContext(LangContext)

  const [buttonBlock, setButtonBlock] = useState(false)
  const [comments, setComments] = useState([])
  const [inputComment, setInputComment] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetchComments();
    setLoaded(true)
    setInterval(() => fetchComments(), 3500)
  }, [itemId])

  const handleChange = (evt) => setInputComment(evt.target.value);

  const fetchComments = async () => {
    const url = `${DB_HOST}/api/items/${itemId}/comments`
    const fetchedComments = await axios.get(url)
    setComments(fetchedComments.data)
  }

  const handleClick = async () => {
    if (inputComment === '' || buttonBlock) return
    setButtonBlock(true)
    const url = `${DB_HOST}/api/comments`
    const body = {
      "author": ctxAuth.loggedUser,
      "content": inputComment,
      "itemId": itemId
    }
    await axios.post(url, body)
    setInputComment('');
    setButtonBlock(false);
  }

  return (
    <section className="CommentSection d-flex flex-column align-items-center mt-5 mb-5">
      {!loaded ? <LoadingSpinner /> : (<>
      {ctxAuth.isLoggedIn ? <div className="CommentSection__addComment d-flex flex-row">
        <textarea type="text" rows="5" cols="60" value={inputComment} onChange={handleChange} placeholder={dictionary.typecomm[ctxLang.language]} />
        <button type="submit" className="btn btn-primary CommentSection__button" onClick={handleClick}>{dictionary.addcomm[ctxLang.language]}</button> </div> : ""}
      <div className="CommentSection__comments d-flex flex-column align-items-center">
        {comments.map(c => <Comment key={c._id} author={c.author} content={c.content} timestamp={c.timestamp} />)}
      </div></>)}
    </section>
  )
}
