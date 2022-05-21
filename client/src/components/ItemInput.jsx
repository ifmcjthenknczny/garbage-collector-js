import React, { useContext, useState, useEffect } from 'react'
import LangContext from '../context/lang-context';
import dictionary from '../content';
import { removeDuplicates } from '../helpers';
import DB_HOST from '../DB_HOST';
import '../styles/ItemInput.css'
import axios from 'axios'
import { filterByTerm } from '../helpers';

export default function ItemInput(props) {
  const { collectionId, clickFunction } = props;
  const { _id: itemId, name, tags, rest, added } = props.itemData
  const ctxLang = useContext(LangContext)
  const [nameValue, setNameValue] = useState(name ? name : "");
  const [tagsValue, setTagsValue] = useState(tags ? tags.join(', ') : "");
  const [buttonBlock, setButtonBlock] = useState(false)
  const [allTags, setAllTags] = useState([])
  const [dropdownValues, setDropdownValues] = useState([])

  useEffect(() => {
    getTags();
  }, [])

  const handleNameChange = (evt) => setNameValue(evt.target.value)
  const handleTagsChange = (evt) => {
    setTagsValue(evt.target.value)
    setDropdownValues(filterByTerm(allTags, evt.target.value.split(', ').at(-1), 3))
  }

  const handleClick = () => {
    if ([nameValue, tagsValue].includes("") || buttonBlock) return
    setButtonBlock(true)
    const body = {
      "name": nameValue,
      "collectionId": collectionId,
      "tags": removeDuplicates(tagsValue.split(', ')).map(tag => tag.toLowerCase().trim())
    }
    clickFunction(body)
    setButtonBlock(false)
  }

  const handleFocus = (evt) => {
    evt.target.scrollLeft = evt.target.scrollWidth;
    setDropdownValues(filterByTerm(allTags, tagsValue.split(',').at(-1), 3))
  }

  const getTags = async () => {
    const url = `${DB_HOST}/api/tags`
    const tags = await axios.get(url)
    setAllTags(tags.data.sort())
  }

  const handleClickDropdownItem = (evt) => {
    setTagsValue(prev => [...prev.split(', ').slice(0, -1), evt.target.textContent].join(', '))
  }

  const tagPlaceholder = `${dictionary.tags[ctxLang.language]} (${dictionary.commasep[ctxLang.language]})`

  return (
    <tr className="ItemInput text-center">
      <td></td>
      <td><input type="text" className="text-center border border-primary rounded" value={nameValue} onChange={handleNameChange} placeholder={dictionary.name[ctxLang.language]} /></td>
      <td><input className="text-center border border-primary rounded dropdown-toggle" type="text" placeholder={tagPlaceholder} value={tagsValue} onChange={handleTagsChange} onFocus={handleFocus} data-bs-toggle="dropdown" aria-expanded="true" />
        <ul className="dropdown-menu" aria-labelledby="Post__input--to" data-popper-placement="bottom-start">
          {dropdownValues.map(e => <li key={e} className="dropdown-item" value={e} onClick={handleClickDropdownItem}>{e}</li>)}
        </ul></td>
      <td><button className="button btn btn-success button rounded" onClick={handleClick}>{itemId ? dictionary.edit[ctxLang.language] : dictionary.add[ctxLang.language]}!</button></td>
    </tr>
  )
}