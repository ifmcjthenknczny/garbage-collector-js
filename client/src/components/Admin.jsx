import '../styles/Admin.css';
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import User from './User'
import AuthContext from '../context/auth-context';
import { useNavigate } from "react-router-dom";
import DB_HOST from '../DB_HOST'
import PanelButton from './PanelButton'
import dictionary from '../content';
import LangContext from '../context/lang-context';
import LoadingSpinner from './LoadingSpinner'
import { userLabels } from '../globals'
import { nanoid } from 'nanoid';

export default function Admin(props) {
    const { theme } = props;
    const [checkedUsers, setCheckedUsers] = useState([]);
    const [users, setUsers] = useState([])
    const [loaded, setLoaded] = useState(false)
    const ctxAuth = useContext(AuthContext);
    const ctxLang = useContext(LangContext);
    let navigate = useNavigate();

    useEffect(() => {
        redirectIfNotAdmin();
        loadData();
    })

    const redirectIfNotAdmin = () => {
        if (!ctxAuth.isAdmin) {
            ctxAuth.onLogout();
            navigate("/");
        }
    }

    const clearCheckboxes = () => {
        const checkboxes = document.querySelectorAll('.form-check-input');
        for (let checkbox of checkboxes) checkbox.checked = false;
        setCheckedUsers([]);
    }

    const updateCheckedUsers = (username) => {
        const oldState = [...checkedUsers]
        let newState = [];
        if (oldState.includes(username)) newState = oldState.filter(u => u !== username);
        else newState = [...oldState, username];
        setCheckedUsers(newState)
    }

    const selectAll = () => {
        const sourceState = document.querySelector('.main-checkbox').checked;
        const checkboxes = document.querySelectorAll('.form-check-input');
        for (let checkbox of checkboxes) checkbox.checked = sourceState;
        if (sourceState) setCheckedUsers([...users].map(u => u.username));
        else setCheckedUsers([])
    }

    const loadData = async () => {
        const data = await axios.get(`${DB_HOST}/api/users`);
        setUsers(data.data);
        setLoaded(true)
    }

    const deleteUsers = async () => {
        await databaseRequest('DELETE');
    }

    const blockUsers = async () => {
        await databaseRequest('BAN', { isActive: false });
    }

    const unblockUsers = async () => {
        const requestBody = { isActive: true };
        await databaseRequest('UNBAN', requestBody);
    }

    const promoteToAdmin = async () => {
        const requestBody = { isAdmin: true };
        await databaseRequest('ADD_ADMIN', requestBody);
    }

    const degradeFromAdmin = async () => {
        const requestBody = { isAdmin: false };
        await databaseRequest('REMOVE_ADMIN', requestBody);
    }

    const databaseRequest = async (request, body) => {
        const concernedUsers = [...checkedUsers];
        const urlTemplate = `${DB_HOST}/api/users`
        let requests;
        if (request === 'DELETE') {
            requests = concernedUsers.map(u => axios.delete(`${urlTemplate}/${u}`));
        }
        else if (['UNBAN', 'BAN', 'ADD_ADMIN', 'REMOVE_ADMIN'].includes(request)) {
            requests = concernedUsers.map(u => axios.patch(`${urlTemplate}/${u}`, body));
        }
        await Promise.all(requests);
        clearCheckboxes();
    }

    return (
        <div className={"Admin d-flex flex-column mt-4 justify-content-center ".concat(theme)}>
            {!loaded ? <LoadingSpinner /> : (<><span className="fs-1 mb-2 fw-bold mb-4">{dictionary.adminPanel[ctxLang.language]}</span>
                <div className="buttons d-flex justify-content-around align-content-center mb-4 align-self-center">
                    <PanelButton text={dictionary.delete[ctxLang.language]} className="fa-solid fa-trash-can fs-3 text-danger" onClick={deleteUsers} />
                    <PanelButton text={dictionary.unblock[ctxLang.language]} className="fa-solid fa-unlock-keyhole fs-3" onClick={unblockUsers} />
                    <PanelButton text={dictionary.block[ctxLang.language]} className="fa-solid fa-ban fs-3 text-danger" onClick={blockUsers} />
                    <PanelButton text={dictionary.addadmin[ctxLang.language]} className="fa-solid fa-crown fs-3" onClick={promoteToAdmin} />
                    <PanelButton text={dictionary.removeadmin[ctxLang.language]} className="fa-solid fa-fire-flame-curved fs-3 text-danger" onClick={degradeFromAdmin} />
                </div>
                <table className="table">
                    <thead><tr>
                        <th><div className="form-check">
                            <input className="form-check-input main-checkbox" type="checkbox" value="" id="flexCheckDefault" onClick={selectAll} />
                        </div></th>
                        {userLabels.map(e => <th key={nanoid()}>{dictionary[e][ctxLang.language]}</th>)}
                    </tr></thead>
                    <tbody>
                        {users.map(e => <User key={e._id} className={theme} id={e._id} name={e.username} email={e.email} lastlogin={e.lastLogin} regtime={e.registrationTime} status={e.isActive ? `${dictionary.active[ctxLang.language]}` : `${dictionary.blocked[ctxLang.language]}`} isAdmin={e.isAdmin} checkboxEvent={updateCheckedUsers} />)}
                    </tbody>
                </table></>)}
        </div>
    )
}