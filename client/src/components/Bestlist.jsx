import React, { useState, useEffect, useContext } from 'react'
import '../styles/Bestlist.css'
import axios from 'axios'
import ListElement from './ListElement'
import ThemeContext from '../context/theme-context';

export default function Bestlist(props) {
    const { header, apiLink, topValueName, bottomValueName, elementLinkTemplate, classes } = props
    const [top, setTop] = useState([]);
    const isDarkMode = useContext(ThemeContext).isDarkMode;

    useEffect(() => {
        getElements();
    }, [])

    const getElements = async () => {
        const elements = await axios.get(apiLink);
        setTop(elements.data);
    }

    return (
        <div className={"Bestlist d-flex flex-column justify-content-center border rounded border-0 align-items-center ".concat(classes)}>
            <h4 className="Bestlist__title">
                {header}
            </h4>
            <ol className="list-group list-group-numbered">
                {top ? top.map(p => <ListElement id={p._id} key={p._id} name={p.name} bottomValue={p[bottomValueName]} topValue={p[topValueName]} urlTemplate={elementLinkTemplate} darkMode={isDarkMode} />) : ""}
            </ol>
        </div>
    )
}