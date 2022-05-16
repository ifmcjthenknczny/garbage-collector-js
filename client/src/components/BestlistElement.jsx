import React from 'react'
import '../styles/BestlistElement.css';

export default function BestlistElement(props) {
    const { name, bottomValue, topValue } = props;
    return (
        <li className="list-group-item d-flex justify-content-between align-items-start BestlistElement">
            <div className="ms-2 BestlistElement__content d-flex flex-column justify-content-center">
                <h6 className="fw-bold BestlistElement__name">
                    {name}
                </h6>
                {bottomValue ? <span className="BestlistElement__price">
                    {bottomValue}
                </span>: ""}
            </div>
            {topValue ? <span className="badge bg-primary rounded-pill BestlistElement__value">
                {topValue}
            </span> : ""}
        </li>
    )
}
