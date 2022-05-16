import React from 'react'
import './Comment.css'

export default function Comment(props) {
  const { author, timestamp, content } = props;
  const timeSent = `${new Date(timestamp).toLocaleDateString()}, ${new Date(timestamp).toLocaleTimeString()}`;
  return (
    <div className="Comment shadow mt-4 border border-1 rounded rounded-3 bg-primary text-light p-2">
      <span className="Comment__middlebar"><h5 className="Comment__author">{author}</h5> <h6 className="Comment__time">{timeSent}</h6></span>
      <span className="Comment__body lead fs-6">{content}</span>
    </div>
  )
}