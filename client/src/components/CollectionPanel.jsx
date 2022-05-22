import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import '../styles/CollectionPanel.css';
import Collection from './Collection';
import DB_HOST from '../DB_HOST';
import dictionary from '../content'
import LangContext from '../context/lang-context'
import PanelButton from './PanelButton'
import CollectionInput from './CollectionInput';

export default function CollectionPanel(props) {
    const { editable, username } = props;

    useEffect(() => {
        fetchCollections();
    }, [username])

    const [checkedCollections, setCheckedCollections] = useState([]);
    const [collections, setCollections] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [addNew, setAddNew] = useState(false)
    const [editOn, setEditOn] = useState(false)
    const [collectionToEdit, setCollectionToEdit] = useState({});
    const ctxLang = useContext(LangContext);

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
        setLoaded(false)
        const data = await axios.get(`${DB_HOST}/api/users/${username}/collections`);
        setLoaded(true)
        setCollections(data.data);
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
            // setCollections([...collections, collectionToEdit])
            await fetchCollections();
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

    const labels = [dictionary.name[ctxLang.language], dictionary.topic[ctxLang.language], dictionary.desc[ctxLang.language], dictionary.size[ctxLang.language]]
    const labelsHTML = labels.map(e => <th key={e}>{e}</th>)

    return (
        <div className="CollectionPanel d-flex flex-column mt-4 justify-content-center align-items-center">
            <span className="fs-1 mb-3 fw-bold">{dictionary.usercoll[ctxLang.language]}:</span>
            {editable ? <div className="buttons CollectionPanel__toolbox d-flex justify-content-around align-content-center mb-4 align-self-center">

                <PanelButton text={dictionary.add[ctxLang.language]} className="fa-solid fa-circle-plus fs-3" onClick={handleClickAdd} />
                {collections.length > 0 ? <><PanelButton text={dictionary.delete[ctxLang.language]} className="fa-solid fa-trash-can fs-3 text-danger" onClick={deleteCollections} />
                    <PanelButton text={dictionary.edit[ctxLang.language]} className="fa-solid fa-gear fs-3" onClick={handleClickEdit} /></> : ""}

            </div> : ""}

            {collections.length === 0 && !addNew && !editOn ? <h3 className="CollectionPanel text-center mt-4">{dictionary.nocoll[ctxLang.language]}</h3> : (
                <table className="CollectionPanel_table table">
                    <thead><tr>
                        {editable ? <th><div className="form-check">
                            <input className="form-check-input main-checkbox" type="checkbox" value="" id="flexCheckDefault" onClick={selectAll} />
                        </div></th> : ""}
                        {labelsHTML}
                    </tr></thead>
                    <tbody>
                        {collections.map(e => <Collection key={e._id} id={e._id} name={e.name} description={e.description} topic={e.topic} imageLink={e.imageLink} items={e.items} editable={editable} created={e.created.toLocaleString(ctxLang.language)} checkboxEvent={updateCheckedCollections} />)}
                        {addNew ? <CollectionInput clickFunction={addCollection} username={username} collectionData={{}} /> : ""}
                        {editOn ? <CollectionInput clickFunction={editCollection} username={username} collectionData={collectionToEdit[0] ?? {}} /> : ""}
                    </tbody>
                </table>)}
        </div>
    )
}