import axios from 'axios';
import { nanoid } from 'nanoid';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import ItemPageInput from '../components/ItemPageInput';
import ItemProperty from '../components/ItemProperty';
import Likebar from '../components/Likebar';
import LoadingSpinner from '../components/LoadingSpinner';
import dictionary from '../content';
import AuthContext from '../context/auth-context';
import LangContext from '../context/lang-context';
import DB_HOST from "../DB_HOST";
import { filterFromObject } from '../helpers';
import '../styles/ItemPage.css';

export default function ItemPage() {
    const params = useParams();
    const { itemId: id } = params;

    const ctxAuth = useContext(AuthContext);
    const ctxLang = useContext(LangContext);

    const [editOn, setEditOn] = useState(false)
    const [itemData, setItemData] = useState({})
    const [loaded, setLoaded] = useState(false)
    const [propertyToEdit, setPropertyToEdit] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        fetchItemData();
    }, [id])

    const { added, author, collectionId, collectionName, likesFrom: whoLiked, name, rest, tags } = itemData;
    const editable = author === ctxAuth.loggedUser || ctxAuth.isAdmin

    const handleClickEdit = async (body) => {
        if (editOn) return
        setEditOn(true)
        setItemData({ ...itemData, rest: filterFromObject(itemData.rest, body) })
        setPropertyToEdit(body)
    }

    const handleDeleteProperty = async (payload) => {
        const patchUrl = `${DB_HOST}/api/items/${id}`
        const { [Object.keys(payload)]: removedProperty, ...newRest } = itemData.rest;
        const body = { rest: newRest }
        await axios.patch(patchUrl, body)
        await fetchItemData();
    }

    const fetchItemData = async () => {
        setLoaded(false)
        const itemData = await axios.get(`${DB_HOST}/api/items/${id}`)
        if (!itemData.data) navigate('/error')
        const { collectionId } = itemData.data
        const collectionData = await axios.get(`${DB_HOST}/api/collections/${collectionId}`);
        let newState = { ...itemData.data, collectionName: collectionData.data.name, author: collectionData.data.author }
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

    const editEnd = async () => {
        setEditOn(false)
        setPropertyToEdit({})
        await fetchItemData()
    }

    return (
        <div className="ItemPage d-flex flex-column align-items-center">
            {!loaded ? <LoadingSpinner /> : (<><div className="ItemPage__header mt-4">
                <h3 className="ItemPage__name">{name}</h3>
                <h5 className="ItemPage__ownership">{dictionary.itemof[ctxLang.language]} <Link className="Link" to={"/collection/".concat(collectionId)}>{collectionName}</Link> {dictionary.byuser[ctxLang.language]} <Link className="Link" to={"/user/".concat(author)}>{author}</Link></h5>
            </div>
                {whoLiked ? <Likebar itemId={id} whoLiked={whoLiked} /> : ""}

                <table className="ItemPage__table mt-5 table align-self-center text-start">
                    <tbody>
                        <tr><td>{dictionary.added[ctxLang.language]}:</td>
                            <td>{new Date(added).toLocaleString(ctxLang.language)}</td>
                            <td></td></tr>
                        <tr><td>{dictionary.tags[ctxLang.language]}:</td>
                            <td>{tags ? tags.join(', ') : ''}</td>
                            <td></td></tr>
                        {rest ? Object.keys(rest).map(e => <ItemProperty key={nanoid()} name={e} value={rest[e]} editable={editable} editFunction={handleClickEdit} deleteFunction={handleDeleteProperty} />) : ''}
                        {editOn ? <ItemPageInput clickFunction={addOrEditProperty} startName={Object.keys(propertyToEdit).at(-1)} startValue={Object.values(propertyToEdit).at(-1)} edited={true} /> : <tr></tr>}
                        {editable && !editOn ? <ItemPageInput clickFunction={addOrEditProperty} /> : <tr></tr>}
                    </tbody>
                </table>
                <CommentSection itemId={id} /></>)}
        </div>
    )

}