import React from 'react'
import '../styles/Button.css'

export default function Button(props) {
    const {onClick, content} = props;
    return (
        <button type="button" className="Button btn btn-secondary align-items-center d-flex justify-content-center" onClick={onClick}>
            {content}
        </button>
    )
}
