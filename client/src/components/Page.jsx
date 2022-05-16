import Main from './Main.jsx'
import { AuthContextProvider } from '../context/auth-context'
import { LangContextProvider } from '../context/lang-context'
import { ThemeContextProvider } from '../context/theme-context'

export default function Page(props) {
    return (
        <ThemeContextProvider>
            <LangContextProvider>
                <AuthContextProvider>
                    <Main />
                </AuthContextProvider>
            </LangContextProvider>
        </ThemeContextProvider>
    )
}