import React from 'react'
import '../styles/PanelButton.css'

export default function PanelButton(props) {
    const { className, text, onClick } = props;
    return (
        <i className={className} onClick={onClick}>
            <span className="fs-6 info pb-2">
                {text}
            </span>
        </i>
    )
}
