import React, { useEffect } from 'react'
import axios from 'axios'
import DB_HOST from '../DB_HOST'

export default function CommentSection(props) {
  const { itemId } = props;

  useEffect(() => {
    const commentRefresh = setInterval(() => fetchComments(), 5000)
    return clearInterval(commentRefresh)
  }, [])

  const fetchComments = () => {

  }

  return (
    <section>Comments</section>
  )
}
