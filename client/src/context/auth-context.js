import {
    createContext,
    useState
} from 'react';

const AuthContext = createContext({
    isLoggedIn: false,
    onLogout: () => {},
    onLogin: (username) => {},
    loggedUser: null,
    isAdmin: false,
    onAdmin: () => {}
});

export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedUser, setLoggedUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const logoutHandler = () => {setIsLoggedIn(false); setLoggedUser(null); setIsAdmin(false)};
    const loginHandler = (username) => {setIsLoggedIn(true); setLoggedUser(username);}
    const adminHandler = () => setIsAdmin(true);
    return (<AuthContext.Provider value={{isLoggedIn: isLoggedIn, loggedUser: loggedUser, isAdmin: isAdmin, onLogout: logoutHandler, onLogin: loginHandler, onAdmin: adminHandler}}>
        {props.children}
    </AuthContext.Provider>)
}

export default AuthContext;