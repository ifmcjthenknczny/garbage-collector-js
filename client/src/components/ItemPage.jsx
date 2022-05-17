import React, { useContext, useEffect, useState } from 'react'
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
import Likebar from './Likebar';
import LoadingSpinner from './LoadingSpinner'

export default function ItemPage() {
    const params = useParams();
    const navigate = useNavigate();

    const [itemData, setItemData] = useState({})
    const [loaded, setLoaded] = useState(false)
    const ctxAuth = useContext(AuthContext);
    const ctxLang = useContext(LangContext)

    useEffect(() => {
        fetchItemData();
    }, [])

    const { itemId: id } = params;
    const { name, tags, added, collectionId, collectionName, likesFrom, rest, author } = itemData;
    // added = new Date(added).toLocaleString(ctxLang.language)
    const editable = author === ctxAuth.loggedUser || ctxAuth.isAdmin

    const fetchItemData = async () => {
        setLoaded(false)
        const iData = await axios.get(`${DB_HOST}/api/items/${id}`);
        const { collectionId } = iData.data
        const collectionData = await axios.get(`${DB_HOST}/api/collections/${collectionId}`);
        const newState = { ...iData.data, collectionName: collectionData.data.name, author: collectionData.data.author }
        setItemData(newState)
        setLoaded(true)
    }

    const handleAddProperty = async (payload) => {
        const patchUrl = `${DB_HOST}/api/items/${id}`
        const body = { rest: {...itemData.rest, ...payload}}
        await axios.patch(patchUrl, body)
        await fetchItemData()
    }

    const handleEditProperty = async () => {

    }

    // const handleDeleteProperty = async () => {

    // }

    return (
        <div className="ItemPage d-flex flex-column align-items-center">
            {/* {!loaded ? <LoadingSpinner /> : ""} */}
            <div className="ItemPage__header">
                <h3 className="ItemPage__name">{name}</h3>
                <h5 className="ItemPage__ownership">{dictionary.itemof[ctxLang.language]} <Link className="Link" to={"/collection/".concat(collectionId)}>{collectionName}</Link> {dictionary.byuser[ctxLang.language]} <Link className="Link" to={"/user/".concat(author)}>{author}</Link></h5>
            </div>
            {likesFrom ? <Likebar itemId={id} whoLiked={likesFrom} /> : ""}

            <table className="ItemPage__table mt-5 table align-self-center text-start">
                <tbody>
                    <tr><td>{dictionary.added[ctxLang.language]}:</td><td>{new Date(added).toLocaleString(ctxLang.language)}</td><td></td></tr>
                    <tr><td>{dictionary.tags[ctxLang.language]}:</td><td>{tags ? tags.join(', ') : ''}</td><td><div className="buttons"><PanelButton text={dictionary.edit[ctxLang.language]} className="fa-solid fa-gear fs-5" onClick={handleEditProperty} /></div></td></tr>
                    {rest ? Object.keys(rest).map(e => <tr><td>{e}:</td><td>{rest[e]}</td></tr>) : ''}
                    {editable ? <ItemPageInput clickFunction={handleAddProperty} /> : <tr></tr>}
                </tbody>
            </table>

            {/* <PanelButton text={dictionary.delete[ctxLang.language]} className="fa-solid fa-trash-can fs-3 text-danger" onClick={handleDeleteProperty} />
            <PanelButton text={dictionary.edit[ctxLang.language]} className="fa-solid fa-gear fs-3" onClick={handleEditProperty} /> */}

            <Button className="mt-5 mb-5 align-self-center justify-self-center" onClick={() => navigate(-1)} content={dictionary.back[ctxLang.language]} />
            <CommentSection className="mt-5" itemId={id} />
        </div>
    )

}