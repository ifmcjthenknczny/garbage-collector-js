import React, { useContext, useState } from 'react'
import LangContext from '../context/lang-context';
import dictionary from '../content';
import { removeDuplicates } from '../helpers';
import '../styles/ItemInput.css'

export default function ItemInput(props) {
  const { collectionId, clickFunction } = props;
  const { _id: itemId, name, tags, rest, added } = props.itemData
  const ctxLang = useContext(LangContext)
  const [nameValue, setNameValue] = useState(name ? name : "");
  const [tagsValue, setTagsValue] = useState(tags ? tags.join(', ') : "");

  const handleChange = (evt, func) => func(evt.target.value)
  const handleNameChange = (evt) => handleChange(evt, setNameValue)
  const handleTagsChange = (evt) => handleChange(evt, setTagsValue)

  const handleClick = () => {
    if ([nameValue, tagsValue].includes("")) return
    const body = {
      "name": nameValue,
      "collectionId": collectionId,
      "tags": removeDuplicates(tagsValue.split(', '))
    }
    clickFunction(body)
  }


  // <i class="fa-solid fa-circle-check"></i>
  const tagPlaceholder = `${dictionary.tags[ctxLang.language]} (${dictionary.commasep[ctxLang.language]})`

  return (
    <tr className="ItemInput text-center">
      <td></td>
      <td><input type="text" className="text-center border border-primary rounded" value={nameValue} onChange={handleNameChange} placeholder={dictionary.name[ctxLang.language]} /></td>
      <td><input type="text" className="text-center border border-primary rounded" value={tagsValue} onChange={handleTagsChange} placeholder={tagPlaceholder} /></td>
      <td><button className="button btn btn-success button rounded" onClick={handleClick}>{itemId ? dictionary.edit[ctxLang.language] : dictionary.add[ctxLang.language]}!</button></td>
    </tr>
  )
}