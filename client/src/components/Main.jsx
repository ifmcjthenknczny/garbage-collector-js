import React, { useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ThemeContext from '../context/theme-context';
import '../styles/Main.css';
import Admin from '../views/Admin';
import CollectionPage from '../views/CollectionPage';
import Error from '../views/Error';
import Frontpage from '../views/Frontpage';
import ItemPage from '../views/ItemPage';
import Login from '../views/Login';
import SearchResultsPage from '../views/SearchResultsPage';
import UserPage from '../views/UserPage';
import BackButton from './BackButton';
import Footer from './Footer';
import Topbar from './Topbar';

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