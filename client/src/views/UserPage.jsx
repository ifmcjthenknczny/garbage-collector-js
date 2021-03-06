import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CollectionPanel from '../components/CollectionPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import dictionary from '../content';
import AuthContext from '../context/auth-context';
import LangContext from '../context/lang-context';
import DB_HOST from "../DB_HOST";

export default function UserPage() {
  const params = useParams();
  const { username } = params;

  const ctxAuth = useContext(AuthContext);
  const ctxLang = useContext(LangContext)

  const [loaded, setLoaded] = useState(false)
  const [userData, setUserData] = useState({})

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, [username])

  let { _id, isActive, isAdmin, lastLogin, registrationTime } = userData;
  if (!lastLogin) lastLogin = dictionary.never[ctxLang.language]
  else lastLogin = new Date(lastLogin).toLocaleString(ctxLang.language)
  registrationTime = new Date(registrationTime).toLocaleString(ctxLang.language)

  const classNameActive = isActive ? "" : "text-danger"
  const classNameAdmin = isAdmin ? "fw-bolder" : "fw-light"
  
  const editable = username === ctxAuth.loggedUser || ctxAuth.isAdmin

  const fetchUserData = async () => {
    const userData = await axios.get(`${DB_HOST}/api/users/${username}`);
    if (!userData.data) navigate('/error')
    setUserData(userData.data);
    setLoaded(true)
  }

  return (
    <div className="UserPage container text-center d-flex flex-column align-items-center">
      {!loaded ? <LoadingSpinner /> : (<>
        <div className="UserPage__header d-flex flex-row justify-content-center text-center align-items-center mt-4">
          <h3 className="UserPage__username me-2">{username}</h3>
          <h4 className="UserPage__id">#{_id}</h4>
        </div>
        <div className="UserPage__ranks d-flex flex-column ">
          <h5 className={"UserPage__admin ".concat(classNameAdmin)}>{isAdmin ? "Administrator" : ""}</h5>
          <h5 className={"UserPage__active mb-4 ".concat(classNameActive)}>{isActive ? dictionary.activeUser[ctxLang.language] : dictionary.blockedUser[ctxLang.language]}</h5>
        </div>
        <div className="UserPage__time d-flex flex-column">
          <h6 className="UserPage__registrationTime">{dictionary.regtime[ctxLang.language]}: {registrationTime}</h6>
          <h6 className="UserPage__lastLogin">{dictionary.lastlogin[ctxLang.language]}: {lastLogin}</h6>
        </div>
        <CollectionPanel editable={editable} username={username} />
      </>)}
    </div>
  )
}