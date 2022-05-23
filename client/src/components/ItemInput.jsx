import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import dictionary from '../content';
import LangContext from '../context/lang-context';
import DB_HOST from '../DB_HOST';
import { filterByTerm, removeDuplicates } from '../helpers';

export default function ItemInput(props) {
  const { clickFunction, collectionId } = props;
  const { _id: itemId, name, tags } = props.itemData

  const ctxLang = useContext(LangContext)

  const [allTags, setAllTags] = useState([])
  const [buttonBlock, setButtonBlock] = useState(false)
  const [dropdownValues, setDropdownValues] = useState([])
  const [nameValue, setNameValue] = useState(name ? name : "");
  const [tagsValue, setTagsValue] = useState(tags ? tags.join(', ') : "");

  const tagPlaceholder = `${dictionary.tags[ctxLang.language]} (${dictionary.commasep[ctxLang.language]})`

  useEffect(() => {
    getTags();
  }, [itemId])

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
      "tags": removeDuplicates(tagsValue.split(', ')).map(tag => tag.toLowerCase().trim().replaceAll(',', ''))
    }
    clickFunction(body)
    setButtonBlock(false)
  }

  const handleClickDropdownItem = (evt) => {
    setTagsValue(prev => [...prev.split(', ').slice(0, -1), evt.target.textContent].join(', '))
  }

  const handleFocus = (evt) => {
    evt.target.scrollLeft = evt.target.scrollWidth;
    setDropdownValues(filterByTerm(allTags, tagsValue.split(', ')[tagsValue.split(', ').length - 1], 3))
  }

  const getTags = async () => {
    const url = `${DB_HOST}/api/tags`
    const tags = await axios.get(url)
    setAllTags(tags.data.sort())
  }

  return (
    <tr className="ItemInput text-center">
      <td></td>
      <td><input type="text" className="text-center border border-primary rounded ItemInput__name" value={nameValue} onChange={handleNameChange} placeholder={dictionary.name[ctxLang.language]} /></td>
      <td><input className="text-center border border-primary rounded dropdown-toggle ItemInput__tags" id="Input__tags" type="text" placeholder={tagPlaceholder} value={tagsValue} onChange={handleTagsChange} onFocus={handleFocus} data-bs-toggle="dropdown" aria-expanded="true" data-bs-auto-close="inside" />
        <ul className="dropdown-menu ItemInput__dropdown" aria-labelledby="ItemInput__tags" data-popper-placement="bottom-start">
          {dropdownValues.map(e => <li key={e} className="dropdown-item" value={e} onClick={handleClickDropdownItem}>{e}</li>)}
        </ul></td>
      <td><button className="ItemInput__button button btn btn-success button rounded" onClick={handleClick}>{itemId ? dictionary.edit[ctxLang.language] : dictionary.add[ctxLang.language]}!</button></td>
    </tr>
  )
}