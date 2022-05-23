import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gfm from 'remark-gfm';
import ItemPanel from '../components/ItemPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import PanelButton from '../components/PanelButton';
import dictionary from '../content';
import AuthContext from '../context/auth-context';
import LangContext from '../context/lang-context';
import DB_HOST from "../DB_HOST";
import '../styles/CollectionPage.css';

export default function CollectionPage() {
  const params = useParams();
  const { collectionId: id } = params;

  const ctxAuth = useContext(AuthContext);
  const ctxLang = useContext(LangContext);

  const [collectionData, setCollectionData] = useState({})
  const [loaded, setLoaded] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    fetchCollectionData();
  }, [id])

  let { author, created, description, imageLink, name, topic } = collectionData;
  created = new Date(created).toLocaleString(ctxLang.language)
  const editable = author === ctxAuth.loggedUser || ctxAuth.isAdmin

  const fetchCollectionData = async () => {
    const collectionData = await axios.get(`${DB_HOST}/api/collections/${id}`)
    if (!collectionData.data) navigate('/error')
    setCollectionData(collectionData.data);
    setLoaded(true)
  }

  const imageUploadHandler = async (evt) => {
    evt.preventDefault();
    const image = evt.target.files[0];
    const formData = new FormData();
    formData.append('file', image)
    const filePath = await axios.post(`${DB_HOST}/api/collections/imageupload`, formData)
    const bodyPatch = {
      imageLink: `/uploads/${filePath.data.image}`
    }
    await axios.patch(`${DB_HOST}/api/collections/${id}`, bodyPatch)
    await fetchCollectionData()
  }

  return (
    <div className="CollectionPage container text-center d-flex flex-column align-items-center">
      {!loaded ? <LoadingSpinner /> : (<>
        <h3 className="CollectionPage__name me-2 mt-4">{name}</h3>
        <h4 className="CollectionPage__author me-3">{dictionary.collby[ctxLang.language]} <Link className="Link" to={`/user/${author}`}>{author}</Link></h4>
        {imageLink ? <img className="CollectionPage__image img-fluid border border-1" src={`${DB_HOST}${imageLink}`} alt={dictionary.collpic[ctxLang.language]} /> : ""}
        {!imageLink && editable ? (<label className="custom-file-upload">
          <input type="file" id="image-input" accept="image/jpeg, image/png" onChange={imageUploadHandler} />
          <PanelButton className="fa-solid fa-images CollectionPage__imagePlaceholder fs-1 text-s" text={dictionary.addpic[ctxLang.language]} onClick={() => { }} />
        </label>
        ) : ""}
        <h5 className="CollectionPage__topic mt-3">{dictionary[topic][ctxLang.language]}</h5>
        <h5 className="CollectionPage__created">{dictionary.createdtime[ctxLang.language]} {created}</h5>
        <h6 className="CollectionPage__description"><ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown></h6>
        <ItemPanel editable={editable} collectionId={id} />
      </>)}
    </div>
  )
}