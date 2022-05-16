import React, { useContext, useEffect, useState } from 'react'
import '../styles/CollectionPage.css'
import dictionary from '../content';
import LangContext from '../context/lang-context';
import AuthContext from '../context/auth-context';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DB_HOST from "../DB_HOST"
import Button from './Button'
import PanelButton from './PanelButton'
import '../styles/ItemPage.css'
import CommentSection from './CommentSection';
import ItemPageInput from './ItemPageInput'

export default function ItemPage(props) {
  const params = useParams();
  const navigate = useNavigate();

  const [itemData, setItemData] = useState({})
  const [loaded, setLoaded] = useState(false)
  const ctxAuth = useContext(AuthContext);
  const ctxLang = useContext(LangContext)

  useEffect(() => {
    fetchItemData();
    console.log(itemData)
  }, [])

  const { itemId: id } = params;

  let { name, tags, added, collectionId, collectionName, likesFrom, rest, author } = itemData;
  const likes = likesFrom.length
  added = new Date(added).toLocaleString(ctxLang.language)
  const editable = author === ctxAuth.loggedUser || ctxAuth.isAdmin

  let likeText = '';
  switch (+likes) {
    case 0: {
      likeText = dictionary.nolikes[ctxLang.language];
      break;
    }
    case 1: {
      likeText = dictionary.onelike[ctxLang.language];
      break;
    }
    default: {
      likeText = `${likes} ${dictionary.morelikes[ctxLang.language]}!`;
    }
  }

  const handleAddProperty = async () => {

  }

  const handleEditProperty = async () => {

  }

  const handleDeleteProperty = async () => {

  }


  const fetchItemData = async () => {
    const data = await axios.get(`${DB_HOST}/api/items/${id}`);
    setItemData(data.data);
    const { collectionId } = itemData;
    const collectionData = await axios.get(`${DB_HOST}/api/collections/${collectionId}`);
    setItemData({ ...itemData, collectionName: collectionData.data.name, author: collectionData.data.author })
    setLoaded(true)
  }

  return (
    <div className="ItemPage">
      <div className="ItemPage__header">
        <h3 className="ItemPage__name">{name}</h3>
        <h5 className="ItemPage__ownership">{dictionary.itemof[ctxLang.language]} <Link className="Link" to={"/collection/".concat(collectionId)}>{collectionName}</Link> {dictionary.byuser[ctxLang.language]} <Link className="Link" to={"/user/".concat(author)}>{author}</Link></h5>
        <p className="ItemPage__likeText me-3">{likeText}</p>
        <PanelButton className="fa-solid fa-thumbs-up ItemPage__likeButton fs-3" text={dictionary.likeit[ctxLang.language]} onClick={() => { }} />
      </div>
      <table className="ItemPage__table mt-5 table align-self-center text-start">
        <tr><td></td><td>{dictionary.added[ctxLang.language]}:</td><td>{added}</td></tr>
        <tr><td></td><td>{dictionary.tags[ctxLang.language]}:</td><td>{tags.join(', ')}</td></tr>
        {Object.keys(rest).map(e => <tr><td>{e}:</td><td>{rest[e]}</td></tr>)}
        {editable ? <ItemPageInput clickFunction={handleAddProperty} /> : ""}
      </table>


      {/* <PanelButton text={dictionary.delete[ctxLang.language]} className="fa-solid fa-trash-can fs-3 text-danger" onClick={handleDeleteProperty} />
            <PanelButton text={dictionary.edit[ctxLang.language]} className="fa-solid fa-gear fs-3" onClick={handleEditProperty} /> */}

      <Button classname="mt-5 align-self-center justify-self-center" onClick={() => navigate(-1)} content={dictionary.back[ctxLang.language]} />
      <CommentSection itemId={id} />

    </div>
  )
}
