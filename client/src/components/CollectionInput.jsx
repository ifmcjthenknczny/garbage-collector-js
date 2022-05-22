import React, { useContext, useState } from 'react'
import LangContext from '../context/lang-context';
import dictionary from '../content';
import '../styles/CollectionInput.css'
import { topicList } from '../globals'

export default function CollectionInput(props) {
  const { username: author, clickFunction } = props;
  const { _id: id, name, topic, description, items } = props.collectionData
  const ctxLang = useContext(LangContext)
  const [nameValue, setNameValue] = useState(name ? name : '');
  const [topicValue, setTopicValue] = useState(topic ? topic : topicList.sort((a, b) => dictionary[a][ctxLang.language] < dictionary[b][ctxLang.language] ? -1 : 1)[0]);
  const [descriptionValue, setDescriptionValue] = useState(description ? description : '');
  const [buttonBlock, setButtonBlock] = useState(false)

  const handleChange = (evt, func) => func(evt.target.value)
  const handleNameChange = (evt) => handleChange(evt, setNameValue)
  const handleTopicChange = (evt) => handleChange(evt, setTopicValue)
  const handleDescriptionChange = (evt) => handleChange(evt, setDescriptionValue)

  const handleClick = () => {
    if ([nameValue, descriptionValue, topicValue].includes("") || buttonBlock) return
    setButtonBlock(true)
    const body = {
      "name": nameValue,
      "description": descriptionValue,
      "topic": topicValue,
      "author": author
    }
    clickFunction(body)
    setButtonBlock(false)
  }

  return (
    <tr className="CollectionInput text-center">
      <td></td>
      <td><input type="text" className="text-center border border-primary rounded" value={nameValue} onChange={handleNameChange} placeholder={dictionary.name[ctxLang.language]} />
      </td>
      <td><select id="topic" onChange={handleTopicChange}>
          {topicList.sort((a, b) => dictionary[a][ctxLang.language] < dictionary[b][ctxLang.language] ? -1 : 1).map(topic => <option className="text-center" key={topic} value={topic}>
            {dictionary[topic][ctxLang.language]}
          </option>)}
        </select></td>
      <td><input type="text" className="text-center border border-primary rounded" value={descriptionValue} onChange={handleDescriptionChange} placeholder={dictionary.desc[ctxLang.language]} /></td>
      <td>{items ?? ""}</td>
      <td><button className="button btn btn-success button rounded" onClick={handleClick}>
          {id ? dictionary.edit[ctxLang.language] : dictionary.add[ctxLang.language]}!
        </button></td>
    </tr>
  )
}
