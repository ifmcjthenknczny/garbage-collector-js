import React, { useContext, useEffect, useState } from 'react'
import '../styles/CollectionPage.css'
import dictionary from '../content';
import LangContext from '../context/lang-context';
import AuthContext from '../context/auth-context';
import ItemPanel from './ItemPanel';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DB_HOST from "../DB_HOST"
import Button from './Button'
import PanelButton from './PanelButton'

export default function CollectionPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [collectionData, setCollectionData] = useState({})
  const [loaded, setLoaded] = useState(false)
  const ctxAuth = useContext(AuthContext);
  const ctxLang = useContext(LangContext)

  useEffect(() => {
    fetchCollectionData();
  }, [])

  const { collectionId: id } = params;
  let { name, description, topic, imageLink, author, items, created } = collectionData;
  created = new Date(created).toLocaleString(ctxLang.language)
  const editable = author === ctxAuth.loggedUser || ctxAuth.isAdmin

  const fetchCollectionData = async () => {
    const collectionData = await axios.get(`${DB_HOST}/api/collections/${id}`);
    setCollectionData(collectionData.data);
    setLoaded(true)
  }

  return (
    <div className="CollectionPage container text-center d-flex flex-column align-items-center">
      {/* {!loaded ? "" : <i className="fa-solid fa-spinner fs-2"></i>} */}

      <h3 className="CollectionPage__name me-2">{name}</h3>
      <h4 className="CollectionPage__author me-3">{dictionary.collby[ctxLang.language]} <Link className="Link" to={`/user/${author}`}>{author}</Link></h4>
      {imageLink ? <img className="CollectionPage__image" src={imageLink} alt={dictionary.collpic[ctxLang.language]} /> : ""}
      {!imageLink && editable ? <PanelButton className="fa-solid fa-images CollectionPage__imagePlaceholder fs-1 text-s" text={dictionary.addpic[ctxLang.language]} onClick={() => { }} /> : ""}
      <h5 className="CollectionPage__topic mt-3">{topic}</h5>
      <h5 className="CollectionPage__created">{dictionary.createdtime[ctxLang.language]} {created}</h5>
      <p className="CollectionPage__description">{description}</p>

      <ItemPanel editable={editable} collectionId={id} />
      <Button classname="mt-5 align-self-center justify-self-center" onClick={() => navigate(-1)} content={dictionary.back[ctxLang.language]} />
    </div>
  )
}