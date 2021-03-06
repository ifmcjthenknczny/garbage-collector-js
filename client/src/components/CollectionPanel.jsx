import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import dictionary from '../content';
import LangContext from '../context/lang-context';
import DB_HOST from '../DB_HOST';
import { collectionLabels } from '../globals';
import '../styles/CollectionPanel.css';
import Collection from './Collection';
import CollectionInput from './CollectionInput';
import LoadingSpinner from './LoadingSpinner';
import PanelButton from './PanelButton';

export default function CollectionPanel(props) {
    const { editable, username } = props;

    const ctxLang = useContext(LangContext);
    
    const [addNew, setAddNew] = useState(false)
    const [alert, setAlert] = useState('')
    const [checkedCollections, setCheckedCollections] = useState([]);
    const [collections, setCollections] = useState([])
    const [collectionToEdit, setCollectionToEdit] = useState({});
    const [editOn, setEditOn] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        fetchCollections();
    }, [username])

    const clearCheckboxes = () => {
        setCheckedCollections([])
        const checkboxes = document.querySelectorAll('.form-check-input');
        for (let checkbox of checkboxes) checkbox.checked = false;
    }

    const updateCheckedCollections = (collectionId) => {
        const oldState = [...checkedCollections]
        let newState = [];
        if (oldState.includes(collectionId)) newState = oldState.filter(u => u !== collectionId);
        else newState = [...oldState, collectionId];
        setCheckedCollections(newState)
    }

    const selectAll = () => {
        const sourceState = document.querySelector('.main-checkbox').checked;
        const checkboxes = document.querySelectorAll('.form-check-input');
        for (let checkbox of checkboxes) checkbox.checked = sourceState;
        if (sourceState) setCheckedCollections([...collections].map(u => u._id));
        else setCheckedCollections([])
    }

    const fetchCollections = async () => {
        const data = await axios.get(`${DB_HOST}/api/users/${username}/collections`);
        setCollections(data.data);
        setLoaded(true);
    }

    const deleteCollections = async () => {
        await databaseRequest('DELETE');
        await fetchCollections();
    }

    const addCollection = async (body) => {
        await databaseRequest('ADD', body)
        await fetchCollections();
        setAddNew(false);
    }

    const editCollection = async (body) => {
        await databaseRequest('EDIT', body)
        setCollectionToEdit({})
        await fetchCollections();
        setEditOn(false);
    }

    const handleClickAdd = () => {
        clearCheckboxes();
        setAddNew(!addNew)
    }

    const handleClickEdit = async () => {
        if (checkedCollections.length === 1 && !editOn) {
            setEditOn(true)
            setCollectionToEdit(collections.filter(c => c._id === checkedCollections.at(-1)))
            setCollections(collections.filter(c => c._id !== checkedCollections.at(-1)))
        } else if (editOn) {
            setEditOn(false)
            setCollectionToEdit({})
            await fetchCollections();
        } else if (checkedCollections.length > 1) {
            setAlert(dictionary.onlyonecheck[ctxLang.language])
            setTimeout(() => setAlert(''), 3000)
        }
        clearCheckboxes();
    }

    const databaseRequest = async (request, body) => {
        const urlTemplate = `${DB_HOST}/api/collections`
        let requests;
        if (request === 'DELETE') requests = checkedCollections.map(id => axios.delete(`${urlTemplate}/${id}`));
        else if (request === 'ADD') requests = [axios.post(urlTemplate, body)]
        else if (request === 'EDIT') requests = [axios.patch(`${urlTemplate}/${collectionToEdit.at(-1)._id}`, body)]
        await Promise.all(requests);
        clearCheckboxes();
    }

    return (
        <div className="CollectionPanel d-flex flex-column mt-4 justify-content-center align-items-center">
        {!loaded ? <LoadingSpinner /> : (<> 
            <span className="fs-2 mb-4 mt-4 CollectionPanel__alert">{alert}</span>
            <span className="fs-1 mb-3 fw-bold CollectionPanel__header">{dictionary.usercoll[ctxLang.language]}:</span>
            {editable ? <div className="buttons CollectionPanel__toolbox d-flex justify-content-around align-content-center mb-4 align-self-center">
                <PanelButton text={dictionary.add[ctxLang.language]} className="fa-solid fa-circle-plus fs-3" onClick={handleClickAdd} />
                {collections.length > 0 ? <><PanelButton text={dictionary.delete[ctxLang.language]} className="fa-solid fa-trash-can fs-3 text-danger" onClick={deleteCollections} />
                    <PanelButton text={dictionary.edit[ctxLang.language]} className="fa-solid fa-gear fs-3" onClick={handleClickEdit} /></> : ""}
            </div> : ""}
            {collections.length === 0 && !addNew && !editOn ? <h3 className="CollectionPanel__error text-center mt-4">{dictionary.nocoll[ctxLang.language]}</h3> : (
                <table className="CollectionPanel_table table">
                    <thead><tr>
                        {editable ? <th><div className="form-check">
                            <input className="form-check-input main-checkbox" type="checkbox" value="" id="flexCheckDefault" onClick={selectAll} />
                        </div></th> : ""}
                        {collectionLabels.map(e => <th key={e}>{dictionary[e][ctxLang.language]}</th>)}
                    </tr></thead>
                    <tbody>
                        {collections.map(e => <Collection key={e._id} id={e._id} name={e.name} description={e.description} topic={e.topic} imageLink={e.imageLink} items={e.items} editable={editable} created={e.created.toLocaleString(ctxLang.language)} checkboxEvent={updateCheckedCollections} />)}
                        {addNew ? <CollectionInput clickFunction={addCollection} username={username} collectionData={{}} /> : ""}
                        {editOn ? <CollectionInput clickFunction={editCollection} username={username} collectionData={collectionToEdit[0] ?? {}} /> : ""}
                    </tbody>
                </table>)}</>)}
        </div>
    )
}