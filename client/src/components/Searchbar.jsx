import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Searchbar.css';

export default function Searchbar(props) {
    const { classes } = props;
    const [searchValue, setSearchValue] = useState('')
    const navigate = useNavigate();

    const handleClick = (evt) => {
        if (searchValue === "") return
        navigate(`/search/${searchValue.replaceAll(' ', '+')}`)
    }

    const handleChange = (evt) => {
        setSearchValue(evt.target.value)
    }

    const handleKeypress = (evt) => {
        if (evt.key === "Enter") handleClick()
    }

    return (
        <div className={"Searchbar input-group mt-3 m-md-3 col-8 col-md-4 d-flex justify-content-center ".concat(classes)}>
            <i className="fa-solid fa-magnifying-glass input-group-text align-self-center d-flex align-items-center justify-content-center Searchbar__button" id="basic-addon1" onClick={handleClick}></i>
            <input type="text" className="form-control Searchbar__input" placeholder={props.placeholder.concat("...")} aria-label="Search" aria-describedby="basic-addon1" value={searchValue} onChange={handleChange} onKeyPress={handleKeypress} />
        </div>
    )
}