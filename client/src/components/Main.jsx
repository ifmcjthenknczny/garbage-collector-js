import React, { useContext } from 'react'
import '../styles/Main.css'
import ThemeContext from '../context/theme-context';
import Topbar from './Topbar'
import Frontpage from './Frontpage'
import Footer from './Footer'
import Login from './Login'
import { Route, Routes, useLocation } from 'react-router-dom'
import Admin from './Admin'
import UserPage from './UserPage'
import CollectionPage from './CollectionPage'
import ItemPage from './ItemPage'
import Error from './Error'
import SearchResultsPage from './SearchResultsPage'
import BackButton from './BackButton';

export default function Main(props) {
    const ctxTheme = useContext(ThemeContext);
    const themeClassName = ctxTheme.isDarkMode ? "dark-theme" : "light-theme";
    const location = useLocation();
    return (
        <div className={"Main d-flex flex-column align-items-center ".concat(themeClassName)}>
            <Topbar theme={themeClassName} />
            <div className="Main__content">
                <Routes>
                    <Route path='/' element={<Frontpage theme={themeClassName} />} exact />
                    <Route path='/login' element={<Login className="" theme={themeClassName} toLoginWindow={true} />} exact />
                    <Route path='/register' element={<Login className="" theme={themeClassName} toLoginWindow={false} />} exact />
                    <Route path='/admin' element={<Admin theme={themeClassName} />} exact />
                    <Route path='/user/:username' element={<UserPage />} exact />
                    <Route path='/collection/:collectionId' element={<CollectionPage />} exact />
                    <Route path='/item/:itemId' element={<ItemPage />} exact />
                    <Route path='/search/:query' element={<SearchResultsPage />} exact />
                    <Route path='/error' element={<Error />} exact />
                    <Route path="*" element={<Error />} />
                </Routes>
            </div>
            {location.pathname !== "/" ? <BackButton /> : ""}
            <Footer theme={themeClassName} />
        </div>
    )
}