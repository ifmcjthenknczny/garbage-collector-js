import React, { useContext, useEffect, useState } from 'react'
import dictionary from '../content';
import LangContext from '../context/lang-context';
import AuthContext from '../context/auth-context';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DB_HOST from "../DB_HOST"
import Button from './Button'
import '../styles/ItemPage.css'
import CommentSection from './CommentSection';
import ItemPageInput from './ItemPageInput'
import Likebar from './Likebar';
import LoadingSpinner from './LoadingSpinner'
import ItemProperty from './ItemProperty';
import { filterFromObject } from '../helpers';

export default function ItemPage() {
    const params = useParams();
    const navigate = useNavigate();

    const [itemData, setItemData] = useState({})
    const [loaded, setLoaded] = useState(false)
    const [editOn, setEditOn] = useState(false)
    const [propertyToEdit, setPropertyToEdit] = useState({});

    const ctxAuth = useContext(AuthContext);
    const ctxLang = useContext(LangContext)

    useEffect(() => {
        fetchItemData();
    }, [])

    const { itemId: id } = params;
    const { name, tags, added, collectionId, collectionName, likesFrom, rest, author } = itemData;
    const editable = author === ctxAuth.loggedUser || ctxAuth.isAdmin

    const fetchItemData = async () => {
        setLoaded(false)
        const iData = await axios.get(`${DB_HOST}/api/items/${id}`);
        const { collectionId } = iData.data
        const collectionData = await axios.get(`${DB_HOST}/api/collections/${collectionId}`);
        let newState = { ...iData.data, collectionName: collectionData.data.name, author: collectionData.data.author }
        setItemData(newState)
        setLoaded(true)
    }

    const addOrEditProperty = async (payload, action) => {
        const patchUrl = `${DB_HOST}/api/items/${id}`
        const body = { rest: { ...itemData.rest, ...payload } }
        await axios.patch(patchUrl, body)
        if (action === 'edit') editEnd()
        else if (action === 'add') fetchItemData()
    }

    const handleClickEdit = async (body) => {
        if (editOn) return
        setEditOn(true)
        setItemData({...itemData, rest: filterFromObject(itemData.rest, body)})
        setPropertyToEdit(body)
    }

    const editEnd = async () => {
        setEditOn(false)
        setPropertyToEdit({})
        await fetchItemData()
    }

    const handleDeleteProperty = async (payload) => {
        const patchUrl = `${DB_HOST}/api/items/${id}`
        const { [Object.keys(payload)]: removedProperty, ...newRest } = itemData.rest;
        const body = { rest: newRest }
        await axios.patch(patchUrl, body)
        await fetchItemData();
    }

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
                    <tr><td>{dictionary.tags[ctxLang.language]}:</td><td>{tags ? tags.join(', ') : ''}</td><td></td></tr>
                    {rest ? Object.keys(rest).map(e => <ItemProperty name={e} value={rest[e]} editable={editable} editFunction={handleClickEdit} deleteFunction={handleDeleteProperty} />) : ''}
                    {editOn ? <ItemPageInput clickFunction={addOrEditProperty} startName={Object.keys(propertyToEdit).at(-1)} startValue={Object.values(propertyToEdit).at(-1)} edited={true} /> : <tr></tr>}
                    {editable && !editOn ? <ItemPageInput clickFunction={addOrEditProperty} /> : <tr></tr>}
                </tbody>
            </table>

            <Button className="mt-5 mb-5 align-self-center justify-self-center" onClick={() => navigate(-1)} content={dictionary.back[ctxLang.language]} />
            <CommentSection itemId={id} />
        </div>
    )

}