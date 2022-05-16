import {
    createContext,
    useState
} from 'react';

const ThemeContext = createContext({
    isDarkMode: false,
    toggleTheme: () => {}
});

export const ThemeContextProvider = (props) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleThemeHandler = () => setIsDarkMode(!isDarkMode);
    return (<ThemeContext.Provider value={{isDarkMode: isDarkMode, toggleTheme: toggleThemeHandler}}>
        {props.children}
    </ThemeContext.Provider>)
}

export default ThemeContext;