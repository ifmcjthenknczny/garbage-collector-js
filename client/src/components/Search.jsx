import React from 'react'
import '../styles/Search.css'

export default function Search(props) {
    return (
        <div className="Search input-group mb-3 d-flex">
            <i className="fa-solid fa-magnifying-glass input-group-text align-self-center" id="basic-addon1"></i>
            <input type="text" className="form-control" placeholder={props.placeholder.concat("...")} aria-label="Username" aria-describedby="basic-addon1" />
        </div>
    )
}