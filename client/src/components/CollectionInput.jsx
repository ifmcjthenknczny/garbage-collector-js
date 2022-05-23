import React, { useContext, useState } from 'react';
import dictionary from '../content';
import LangContext from '../context/lang-context';
import { topicList } from '../globals';
import '../styles/CollectionInput.css';

export default function CollectionInput(props) {
  const { clickFunction, username: author } = props;
  const { description, _id: id, items, name, topic } = props.collectionData

  const ctxLang = useContext(LangContext)

  const [buttonBlock, setButtonBlock] = useState(false)
  const [descriptionValue, setDescriptionValue] = useState(description ? description : '');
  const [nameValue, setNameValue] = useState(name ? name : '');
  const [topicValue, setTopicValue] = useState(topic ? topic : topicList.sort((a, b) => dictionary[a][ctxLang.language] < dictionary[b][ctxLang.language] ? -1 : 1)[0]);

  const handleChange = (evt, func) => func(evt.target.value)
  const handleDescriptionChange = (evt) => handleChange(evt, setDescriptionValue)
  const handleNameChange = (evt) => handleChange(evt, setNameValue)
  const handleTopicChange = (evt) => handleChange(evt, setTopicValue)

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
      <td><button className="button btn btn-success button rounded CollectionInput__button" onClick={handleClick}>
        {id ? dictionary.edit[ctxLang.language] : dictionary.add[ctxLang.language]}!
      </button></td>
    </tr>
  )
}
