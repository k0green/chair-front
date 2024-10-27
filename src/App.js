import './App.css';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
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
import React, {useContext, useEffect, useState} from 'react';
import Header from "./components/Header";
import MobileHeader from "./components/MobileHeader";
import Footer from "./components/Footer";
import { ThemeProvider } from './components/ThemeProvider';
import {ThemeContext} from "./components/ThemeContext";
import {LanguageContext, LanguageProvider} from './components/LanguageContext';
import translationEN from './locales/translationEn.json';
import translationRU from './locales/translationRu.json';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaQuery } from 'react-responsive';
import Cookies from "js-cookie";
import EditPromotionCard from "./components/EditPromotionCard";
import AddPromotionCardPage from "./pages/AddPromotionCardPage";
import FullServiceCardPage from "./pages/FullServiceCardPage";
import ErrorComponent from "./pages/ErrorPage";
import EditPromotionCardPage from "./pages/EditPromotionCardPage";

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

        toast.dismiss();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <h1>Oops! Something went wrong.</h1>
                    <p>We're sorry for the inconvenience. Please try again later.</p>
                    <button onClick={() => window.location.href = '/'}>Go to Home Page</button>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    const [language, setLanguage] = useState(() => Cookies.get('language') || 'ru');
    const [city, setCity] = useState(() => Cookies.get('city') || '');

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await getCityFromCoordinates(latitude, longitude);
                },
                (error) => {
                    console.error('Ошибка получения геолокации:', error);
                }
            );
        } else {
            console.error('Геолокация не поддерживается вашим браузером');
        }
    };

    const YANDEX_API_KEY = 'd2aa6dcc-1f35-4ed7-a13b-fe4064f9904f';

    const getCityFromCoordinates = async (lat, lng) => {
        try {
            const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_API_KEY}&format=json&geocode=${lng},${lat}&results=1&kind=locality`);
            const data = await response.json();

            const geoObject = data.response.GeoObjectCollection.featureMember[0].GeoObject;
            const cityName = geoObject.name || '';
            const cityDescription = geoObject.description || '';

            const city = {
                label: `${cityName}, ${cityDescription}`,
                value: cityName
            };

            Cookies.set('city', city.value, { expires: 365 });
            setCity(city.value);
        } catch (error) {
            console.error('Ошибка при получении данных от Yandex Geocoder:', error);
        }
    };

    useEffect(() => {
        Cookies.set('language', language, { expires: 365 });

        if(Cookies.get("city") === null )
            getUserLocation();
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translations }}>
            <ThemeProvider>
                <Router>
                    <ErrorBoundary>
                        <AppContent city={city}/>
                    </ErrorBoundary>
                    <ToastContainer />
                </Router>
            </ThemeProvider>
        </LanguageContext.Provider>
    );
}


function AppContent({city}) {
  const { theme } = useContext(ThemeContext);
    const isMobile = useMediaQuery({ query: '(max-width: 1025px)' });

  return (
      <div className={`app ${theme === 'dark' ? 'dark' : ''}`}>
        {!isMobile && <Header city = {city}/>}
        {isMobile && <MobileHeader/>}
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
                <Route path="/promotion-card/edit/:id" element={<EditPromotionCardPage />} />
                <Route path="/promotion-card/add/:id" element={<AddPromotionCardPage />} />
                <Route path="/reviews/:id" element={<ReviewsPage />} />
                <Route path="/service-card/full/:id" element={<FullServiceCardPage />} />
                <Route path="/collection/category/:id" element={<CategoryPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/trigger-error" element={<ErrorComponent />} />
            </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;

