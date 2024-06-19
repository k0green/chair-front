import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Main from "./pages/Main";
import Calendar from "./pages/Calendar";
import CalendarEdit from "./pages/CalendarEdit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditUser from "./pages/EditUser";
import Chat from "./pages/ChatPage";
import Messages from "./pages/MessagesPage";
import Profile from "./pages/ProfilePage";
import EditServiceCard from "./pages/EditServiceCardPage";
import AddServiceCard from "./pages/AddServiceCardPage";
import CategoryPage from "./pages/CategoryPage";
import OrdersPage from "./pages/OrdersPage";
import ReviewsPage from "./pages/ReviewsPage";
import React, {useContext, useState} from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from './components/ThemeProvider';
import {ThemeContext} from "./components/ThemeContext";
import { LanguageContext } from './components/LanguageContext';
import translationEN from './locales/translationEn.json';
import translationRU from './locales/translationRu.json';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const translations = {
    en: translationEN,
    ru: translationRU
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <h1>Что-то пошло не так.</h1>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                    <button onClick={() => window.location.href = '/'}>Перейти на главную</button>
                </div>
            );
        }

        return this.props.children;
    }
}


function App() {
    const [language, setLanguage] = useState('en');

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translations }}>
            <ThemeProvider>
                <Router>
                    <ErrorBoundary>
                        <AppContent />
                    </ErrorBoundary>
                    <ToastContainer />
                </Router>
            </ThemeProvider>
        </LanguageContext.Provider>
    );
}


function AppContent() {
  const { theme } = useContext(ThemeContext);

  return (
      <div className={`app ${theme === 'dark' ? 'dark' : ''}`}>
        <Header />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/calendar/:id" element={<Calendar full={false}/>}/>
            <Route path="/calendar/full" element={<Calendar full={true}/>}/>
            <Route path="/calendar/edit/:id" element={<CalendarEdit full={false}/>}/>
            <Route path="/calendar/full/edit" element={<CalendarEdit full={true}/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/edit-user" element={<EditUser/>}/>
            <Route path="/chats" element={<Chat/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/messages/:id" element={<Messages />} />
            <Route path="/service-card/edit/:id" element={<EditServiceCard />} />
            <Route path="/service-card/add/:id" element={<AddServiceCard />} />
            <Route path="/reviews/:id" element={<ReviewsPage />} />
            <Route path="/collection/category/:id" element={<CategoryPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;

