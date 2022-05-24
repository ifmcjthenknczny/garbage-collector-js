import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ThemeContext from '../context/theme-context';
import '../styles/Bestlist.css';
import ListElement from './ListElement';

export default function Bestlist(props) {
    const { apiLink, bottomValueName, classes, elementLinkTemplate, header, topValueName } = props;
    const { isDarkMode } = useContext(ThemeContext);
    const [top, setTop] = useState([]);

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
            <ol className="list-group list-group-numbered Bestlist__list">
                {top ? top.map(p => <ListElement id={p._id} key={p._id} name={p.name} bottomValue={p[bottomValueName]} topValue={p[topValueName]} urlTemplate={elementLinkTemplate} darkMode={isDarkMode} />) : ""}
            </ol>
        </div>
    )
}