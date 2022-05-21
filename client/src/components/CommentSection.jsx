import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import DB_HOST from '../DB_HOST'
import Button from './Button'
import AuthContext from '../context/auth-context'
import LangContext from '../context/lang-context'
import dictionary from '../content'
import Comment from './Comment'

export default function CommentSection(props) {
  const { itemId } = props;
  const [comments, setComments] = useState([])
  const [inputComment, setInputComment] = useState('')
  const ctxAuth = useContext(AuthContext)
  const ctxLang = useContext(LangContext)

  useEffect(() => {
    fetchComments();
    setInterval(() => fetchComments(), 4000)
    // return clearInterval(commentRefresh)
  }, [])

  const fetchComments = async () => {
    const url = `${DB_HOST}/api/items/${itemId}/comments`
    const fetchedComments = await axios.get(url)
    setComments(fetchedComments.data)
  }

  const handleChange = (evt) => {
    setInputComment(evt.target.value);
  }

  const addComment = async () => {
    if (inputComment === '') return
    const url = `${DB_HOST}/api/comments`
    const body = {
      "author": ctxAuth.loggedUser,
      "content": inputComment,
      "itemId": itemId
    }
    await axios.post(url, body)
    setInputComment('');
  }

  return (
    <section className="CommentSection d-flex flex-column align-items-center mt-5">
      {ctxAuth.isLoggedIn ? <div className="CommentSection__addComment d-flex flex-row">
        <textarea type="text" rows="5" cols="60" value={inputComment} onChange={handleChange} placeholder={dictionary.typecomm[ctxLang.language]} /> <Button onClick={addComment} content={dictionary.addcomm[ctxLang.language]} /> </div> : ""}
      <div className="CommentSection__comments d-flex flex-column align-items-center">{comments.map(c => <Comment key={c._id} author={c.author} content={c.content} timestamp={c.timestamp} />)}</div>
    </section>
  )
}
