import { AuthContextProvider } from '../context/auth-context';
import { LangContextProvider } from '../context/lang-context';
import { ThemeContextProvider } from '../context/theme-context';
import '../styles/App.css';
import Main from './Main.jsx';

export default function App() {
  return (
    <div className="App">
      <ThemeContextProvider>
        <LangContextProvider>
          <AuthContextProvider>
            <Main />
          </AuthContextProvider>
        </LangContextProvider>
      </ThemeContextProvider>
    </div>
  );
}