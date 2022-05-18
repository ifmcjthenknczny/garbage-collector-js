import React, { useContext, useState } from 'react'
import LangContext from '../context/lang-context';
import dictionary from '../content';
import '../styles/CollectionInput.css'

export default function CollectionInput(props) {
  const { username: author, clickFunction } = props;
  const { _id: id, name, topic, description, created, items } = props.collectionData
  const ctxLang = useContext(LangContext)
  const [nameValue, setNameValue] = useState(name ? name : undefined);
  const [topicValue, setTopicValue] = useState(topic ? topic : undefined);
  const [descriptionValue, setDescriptionValue] = useState(description ? description : undefined);
  
  const handleChange = (evt, func) => func(evt.target.value)
  const handleNameChange = (evt) => handleChange(evt, setNameValue)
  const handleTopicChange = (evt) => handleChange(evt, setTopicValue)
  const handleDescriptionChange = (evt) => handleChange(evt, setDescriptionValue)

  const handleClick = () => {
    if ([nameValue, descriptionValue, topicValue].includes("")) return
    const body = {
      "name": nameValue,
      "description": descriptionValue,
      "topic": topicValue,
      "author": author
    }
    clickFunction(body)
  }

  // działająca data
  // new Date(created).toLocaleString(ctxLang.language)

  return (
    <tr className="Collection text-center">
      <td></td>
      <td><input type="text" className="text-center border border-primary rounded" value={nameValue} onChange={handleNameChange} placeholder={dictionary.name[ctxLang.language]} /></td>
      <td><input type="text" className="text-center border border-primary rounded" value={topicValue} onChange={handleTopicChange} placeholder={dictionary.topic[ctxLang.language]} /></td>
      <td><input type="text" className="text-center border border-primary rounded" value={descriptionValue} onChange={handleDescriptionChange} placeholder={dictionary.desc[ctxLang.language]} /></td>
      <td>{items ?? ""}</td>
      <td><button className="button btn btn-success button rounded" onClick={handleClick}>{id ? dictionary.edit[ctxLang.language] : dictionary.add[ctxLang.language]}!</button></td>
    </tr>
  )
}
