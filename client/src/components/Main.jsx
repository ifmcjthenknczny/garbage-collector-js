import React, { useContext } from 'react'
import '../styles/Main.css'
import ThemeContext from '../context/theme-context';
import Topbar from './Topbar'
import Frontpage from './Frontpage'
import Footer from './Footer'
import Login from './Login'
import { Route, Routes } from 'react-router-dom'
import Admin from './Admin'
import UserPage from './UserPage'
import CollectionPage from './CollectionPage'
import ItemPage from './ItemPage'
import Error from './Error'
import SearchResults from './SearchResults'

export default function Main(props) {
    const ctxTheme = useContext(ThemeContext);
    const themeClassName = ctxTheme.isDarkMode ? "dark-theme" : "light-theme";
    return (
        <div className={"Main d-flex flex-column align-items-center justify-content-center ".concat(themeClassName)}>
            <Topbar theme={themeClassName} />
            <div className="Main__content">
                <Routes>
                    <Route path='/' element={<Frontpage theme={themeClassName} />} exact />
                    <Route path='/login' element={<Login className="" theme={themeClassName} loginWindow={true} />} exact />
                    <Route path='/register' element={<Login className="" theme={themeClassName} loginWindow={false} />} exact />
                    <Route path='/admin' element={<Admin theme={themeClassName} />} exact />
                    <Route path='/user/:username' element={<UserPage />} exact />
                    <Route path='/collection/:collectionId' element={<CollectionPage />} exact />
                    <Route path='/item/:itemId' element={<ItemPage />} exact />
                    <Route path='/search/:query' element={<SearchResults />} exact />
                    <Route path='/error' element={<Error />} exact />
                    <Route path="*" element={<Error />} />
                </Routes>
            </div>
            <Footer theme={themeClassName} />
        </div>
    )
}