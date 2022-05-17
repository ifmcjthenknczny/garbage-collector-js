import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import '../styles/ItemPanel.css';
import Item from './Item';
import DB_HOST from '../DB_HOST';
import dictionary from '../content'
import LangContext from '../context/lang-context'
import PanelButton from './PanelButton'
import ItemInput from './ItemInput';

export default function ItemPanel(props) {
  const { editable, collectionId: id } = props;

  useEffect(() => {
    fetchItems();
  }, [])

  const [checkedItems, setCheckedItems] = useState([]);
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [addNew, setAddNew] = useState(false)
  const [editOn, setEditOn] = useState(false)
  const [itemToEdit, setItemToEdit] = useState({});
  const ctxLang = useContext(LangContext);

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

  const fetchItems = async () => {
    setLoaded(false)
    const data = await axios.get(`${DB_HOST}/api/collections/${id}/items`);
    setLoaded(true)
    setItems(data.data);
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

  const handleClickEdit = async () => {
    if (checkedItems.length === 1 && !editOn) {
      setEditOn(true)
      setItemToEdit(items.filter(c => c._id === checkedItems.at(-1)))
      setItems(items.filter(c => c._id !== checkedItems.at(-1)))
    } else if (editOn) {
      setEditOn(false)
      setItemToEdit({})
      await fetchItems();
    }
    clearCheckboxes();
  }

  const databaseRequest = async (request, body) => {
    const urlTemplateItems = `${DB_HOST}/api/items`
    const urlTemplateCollections = `${DB_HOST}/api/collections/${id}`
    let requests;
    if (request === 'DELETE') {
      requests = checkedItems.map(id => axios.delete(`${urlTemplateItems}/${id}`));
      requests.push(axios.patch(`${urlTemplateCollections}/inc`,{change: -checkedItems.length}))
    }
    else if (request === 'ADD') {
      requests = [axios.post(urlTemplateItems, body), axios.patch(`${urlTemplateCollections}/inc`,{change: 1})]
    }
    else if (request === 'EDIT') requests = [axios.patch(`${urlTemplateItems}/${itemToEdit.at(-1)._id}`, body)]
    await Promise.all(requests);
    clearCheckboxes();
  }

  // name: String,
  // tags: Array,
  // collectionId: String,
  // added: Date,
  // rest: Map

  const labels = [dictionary.name[ctxLang.language], `${dictionary.tags[ctxLang.language]} (${dictionary.commasep[ctxLang.language]})`]
  if (items.length > 0) Object.keys(items[0].rest).forEach(e => labels.push(e))
  const labelsHTML = labels.map(e => <th>{e}</th>)
  const itemsData = items.map(e => <Item key={e._id} id={e._id} name={e.name} tags={e.tags} rest={e.rest} editable={editable} added={e.added.toLocaleString(ctxLang.language)} checkboxEvent={updateCheckedItems} />)

  return (
    <div className="ItemPanel d-flex flex-column mt-4 justify-content-center align-items-center">
      <span className="fs-1 mb-3 fw-bold">{dictionary.items[ctxLang.language]}:</span>
      <div className="buttons ItemPanel__toolbox d-flex justify-content-around align-content-center mb-4 align-self-center">
        {editable ? <>
          <PanelButton text={dictionary.add[ctxLang.language]} className="fa-solid fa-circle-plus fs-3" onClick={handleClickAdd} />
          {items.length > 0 ? <><PanelButton text={dictionary.delete[ctxLang.language]} className="fa-solid fa-trash-can fs-3 text-danger" onClick={deleteCollections} />
            <PanelButton text={dictionary.edit[ctxLang.language]} className="fa-solid fa-gear fs-3" onClick={handleClickEdit} />
        <PanelButton text={dictionary.sort[ctxLang.language]} className="fa-solid fa-arrow-down-a-z fs-3" onClick={() => { }} />
        <PanelButton text={dictionary.filter[ctxLang.language]} className="fa-solid fa-filter fs-3" onClick={() => { }} /></> : ""}
        </> : ""}
      </div>

      {items.length === 0 && !addNew && !editOn ? <h3 className="ItemPanel text-center mt-4">{dictionary.noitems[ctxLang.language]}</h3> : (
        <table className="ItemPanel_table table">
          <thead><tr>
            {editable ? <th><div className="form-check">
              <input className="form-check-input main-checkbox" type="checkbox" value="" id="flexCheckDefault" onClick={selectAll} />
            </div></th> : ""}
            {labelsHTML}
          </tr></thead>
          <tbody>
            {itemsData}
            {addNew ? <ItemInput clickFunction={addCollection} collectionId={id} itemData={{}} /> : ""}
            {editOn ? <ItemInput clickFunction={editCollection} collectionId={id} itemData={itemToEdit[0] ?? {}} /> : ""}
          </tbody>
        </table>)}
    </div>
  )
}