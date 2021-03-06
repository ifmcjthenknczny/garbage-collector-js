import axios from 'axios';
import { nanoid } from 'nanoid';
import React, { useContext, useEffect, useState } from 'react';
import dictionary from '../content';
import LangContext from '../context/lang-context';
import DB_HOST from '../DB_HOST';
import '../styles/ItemPanel.css';
import Item from './Item';
import ItemInput from './ItemInput';
import LoadingSpinner from './LoadingSpinner';
import PanelButton from './PanelButton';

export default function ItemPanel(props) {
  const { collectionId: id, editable } = props;

  const ctxLang = useContext(LangContext);

  const [addNew, setAddNew] = useState(false)
  const [alert, setAlert] = useState('')
  const [areItemsAlphabetical, setAreItemsAlphabetical] = useState(undefined)
  const [checkedItems, setCheckedItems] = useState([]);
  const [editOn, setEditOn] = useState(false)
  const [filter, setFilter] = useState('')
  const [filterVisibility, setFilterVisibility] = useState(false)
  const [items, setItems] = useState([])
  const [itemToEdit, setItemToEdit] = useState({});
  const [loaded, setLoaded] = useState(false);

  const labels = [dictionary.name[ctxLang.language], `${dictionary.tags[ctxLang.language]} (${dictionary.commasep[ctxLang.language]})`]

  useEffect(() => {
    fetchItems();
  }, [id])

  useEffect(() => {
    setItems(prev => prev.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()) || item.tags.some(e => e.toLowerCase().includes(filter.toLowerCase()))));
    clearCheckboxes();
  }, [filter])

  const clearCheckboxes = () => {
    setCheckedItems([])
    const checkboxes = document.querySelectorAll('.form-check-input');
    for (let checkbox of checkboxes) checkbox.checked = false;
  }

  const updateCheckedItems = (itemId) => {
    const oldState = [...checkedItems]
    let newState = [];
    if (oldState.includes(itemId)) newState = oldState.filter(u => u !== itemId);
    else newState = [...oldState, itemId];
    setCheckedItems(newState)
  }

  const selectAll = () => {
    const sourceState = document.querySelector('.main-checkbox').checked;
    const checkboxes = document.querySelectorAll('.form-check-input');
    for (let checkbox of checkboxes) checkbox.checked = sourceState;
    if (sourceState) setCheckedItems([...items].map(u => u._id));
    else setCheckedItems([])
  }

  const handleSort = () => {
    const itemsSorted = items.sort((a, b) => (a.name > b.name) ? 1 : -1)
    if (areItemsAlphabetical) {
      setItems([...itemsSorted].reverse())
      setAreItemsAlphabetical(false)
    } else {
      setItems(itemsSorted)
      setAreItemsAlphabetical(true)
    }
  }

  const handleFilterInput = async (evt) => {
    setFilter(evt.target.value)
  }

  const handleFilterClick = (evt) => {
    setFilterVisibility(!filterVisibility)
  }

  const fetchItems = async () => {
    const data = await axios.get(`${DB_HOST}/api/collections/${id}/items`);
    setItems(data.data);
    setLoaded(true);
  }

  const deleteCollections = async () => {
    await databaseRequest('DELETE');
    await fetchItems();
  }

  const addCollection = async (body) => {
    await databaseRequest('ADD', body)
    await fetchItems();
    setAddNew(false);
  }

  const editCollection = async (body) => {
    await databaseRequest('EDIT', body)
    setItemToEdit({})
    await fetchItems();
    setEditOn(false);
  }

  const handleClickAdd = () => {
    clearCheckboxes();
    setAddNew(!addNew)
  }

  const handleClickClearFilter = (evt) => {
    setFilter('')
    fetchItems()
  }

  const handleClickEdit = async () => {
    if (checkedItems.length === 1 && !editOn) {
      setEditOn(true)
      setItemToEdit(items.filter(c => c._id === checkedItems.at(-1)))
      setItems(items.filter(c => c._id !== checkedItems.at(-1)))
    } else if (editOn) {
      setEditOn(false)
      setItemToEdit({})
      await fetchItems();
    } else if (checkedItems.length > 1) {
      setAlert(dictionary.onlyonecheck[ctxLang.language])
      setTimeout(() => setAlert(''), 3000)
    }
    clearCheckboxes();
  }

  const databaseRequest = async (request, body) => {
    const urlTemplateItems = `${DB_HOST}/api/items`
    const urlTemplateCollections = `${DB_HOST}/api/collections/${id}`
    let requests;
    if (request === 'DELETE') {
      requests = checkedItems.map(id => axios.delete(`${urlTemplateItems}/${id}`));
      requests.push(axios.patch(`${urlTemplateCollections}/inc`, { change: -checkedItems.length }))
    }
    else if (request === 'ADD') {
      requests = [axios.post(urlTemplateItems, body), axios.patch(`${urlTemplateCollections}/inc`, { change: 1 })]
    }
    else if (request === 'EDIT') requests = [axios.patch(`${urlTemplateItems}/${itemToEdit.at(-1)._id}`, body)]
    await Promise.all(requests);
    clearCheckboxes();
  }

  return (

    <div className="ItemPanel d-flex flex-column mt-4 justify-content-center align-items-center">
      {!loaded ? <LoadingSpinner /> : (<>
        <span className="fs-2 mb-4 mt-4 ItemPanel__alert">{alert}</span>
        <span className="fs-1 mb-3 fw-bold ItemPanel__header">{dictionary.items[ctxLang.language]}:</span>
        <div className="buttons ItemPanel__toolbox d-flex justify-content-around align-content-center mb-4 align-self-center">
          {editable ? <PanelButton text={dictionary.add[ctxLang.language]} className="fa-solid fa-circle-plus fs-3" onClick={handleClickAdd} /> : ""}
          {editable && items.length > 0 ? <><PanelButton text={dictionary.delete[ctxLang.language]} className="fa-solid fa-trash-can fs-3 text-danger" onClick={deleteCollections} />
            <PanelButton text={dictionary.edit[ctxLang.language]} className="fa-solid fa-gear fs-3" onClick={handleClickEdit} /></> : ""}
          {items.length > 1 ? <><PanelButton text={dictionary.sort[ctxLang.language]} className="fa-solid fa-arrow-down-a-z fs-3" onClick={handleSort} />
            <PanelButton text={dictionary.filter[ctxLang.language]} className="fa-solid fa-filter fs-3" onClick={handleFilterClick} /></> : ""}
        </div>
        <div className="ItemPanel__filter d-flex flex-row mb-3">
          <input type={filterVisibility ? "text" : "hidden"} value={filter} onChange={handleFilterInput} placeholder={dictionary.enterfilter[ctxLang.language]} />
          {filterVisibility ? <button className="btn btn-secondary ms-3" onClick={handleClickClearFilter}>{dictionary.clearfilter[ctxLang.language]}</button> : ""}
        </div>
        {items.length === 0 && !addNew && !editOn ? <h3 className="ItemPanel text-center mt-4">{dictionary.noitems[ctxLang.language]}</h3> : (
          <table className="ItemPanel_table table">
            <thead><tr>
              {editable ? <th><div className="form-check">
                <input className="form-check-input main-checkbox" type="checkbox" value="" id="flexCheckDefault" onClick={selectAll} />
              </div></th> : ""}
              {labels.map(e => <th key={nanoid()}>{e}</th>)}
            </tr></thead>
            <tbody>
              {items.map(e => <Item key={e._id} id={e._id} name={e.name} tags={e.tags} rest={e.rest} editable={editable} added={e.added.toLocaleString(ctxLang.language)} checkboxEvent={updateCheckedItems} />)}
              {addNew ? <ItemInput clickFunction={addCollection} collectionId={id} itemData={{}} /> : ""}
              {editOn ? <ItemInput clickFunction={editCollection} collectionId={id} itemData={itemToEdit[0] ?? {}} /> : ""}
            </tbody>
          </table>)}</>)}
    </div>
  )
}