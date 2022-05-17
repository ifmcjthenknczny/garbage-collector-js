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
// import ItemPage from './ItemPage'

function Main(props) {
    const ctxTheme = useContext(ThemeContext);
    const themeClassName = ctxTheme.isDarkMode ? "dark-theme" : "light-theme";
    return (
        <div className={"Main d-flex flex-column align-items-center justify-content-center ".concat(themeClassName)}>
            <Topbar theme={themeClassName} />
            <Routes>
                <Route path='/login' element={<Login className="" theme={themeClassName} loginWindow={true} />} exact />
                <Route path='/register' element={<Login className="" theme={themeClassName} loginWindow={false} />} exact />
                <Route path='/admin' element={<Admin theme={themeClassName} />} exact />
                <Route path='/user/:username' element={<UserPage />} exact />
                <Route path='/collection/:collectionId' element={<CollectionPage />} exact />
                <Route path='/item/:itemId' element={<ItemPage />} exact />

                <Route path='' element={<Frontpage theme={themeClassName} />} />
            </Routes>
            <Footer theme={themeClassName} />
        </div>
    )
}

export default Main