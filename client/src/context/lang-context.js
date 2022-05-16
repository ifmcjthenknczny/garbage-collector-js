import {
    createContext,
    useState
} from 'react';

const LangContext = createContext({
    language: 'en'
});

export const LangContextProvider = (props) => {
    const [language, setLanguage] = useState('en');
    const toggleLanguageHandler = () => setLanguage(prev => {
        if (prev === "en") return "pl";
        else return "en";
    });
    return (<LangContext.Provider value={{language: language, toggleLanguage: toggleLanguageHandler}}>
        {props.children}
    </LangContext.Provider>)
}

export default LangContext;