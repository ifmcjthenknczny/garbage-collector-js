import React, {useState, useEffect} from 'react'
import '../styles/Bestlist.css'
import axios from 'axios'
import BestlistElement from './BestlistElement'

export default function Bestlist(props) {
    const {header, apiLink, topValueName, bottomValueName} = props
    const [top, setTop] = useState([]);

    useEffect(() => {
        getElements();
    })

    const getElements = async () => {
        const elements = await axios.get(apiLink);
        setTop(elements.data);
    }

    return (
        <div className="Bestlist d-flex flex-column justify-content-center border rounded border-0 align-items-center">
            <h4 className="Bestlist__title">
                {header}
            </h4>
            <ol className="list-group list-group-numbered">
                {/* {top ? top.map(p => <BestlistElement key={p._id} name={p.name} bottomValue={p[bottomValueName]} topValue={p[topValueName]} />) : ""} */}
            </ol>
        </div>
    )
}