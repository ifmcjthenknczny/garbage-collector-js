import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import '../styles/Search.css'

export default function Search(props) {
    const { classes } = props;
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('')

    const handleClick = (evt) => {
        if (searchValue === "") return
        navigate(`/search/${searchValue.replaceAll(' ', '+')}`)
    }

    const handleChange = (evt) => {
        setSearchValue(evt.target.value)
    }

    return (
        <div className={"Search input-group mt-3 m-md-3 col-8 col-md-4 d-flex justify-content-center ".concat(classes)}>
            <i className="fa-solid fa-magnifying-glass input-group-text align-self-center" id="basic-addon1" onClick={handleClick}></i>
            <input type="text" className="form-control" placeholder={props.placeholder.concat("...")} aria-label="Search" aria-describedby="basic-addon1" value={searchValue} onChange={handleChange} />
        </div>
    )
}