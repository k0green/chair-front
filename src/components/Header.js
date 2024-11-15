import {useLocation, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDoorOpen, faUser, faUserEdit} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useState} from "react";
import "../styles/Header.css";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import {accountExit} from "./api";
import {faSave} from "@fortawesome/free-solid-svg-icons/faSave";
import CitySelector from "./CitySelector";
import {faMoon} from "@fortawesome/free-solid-svg-icons/faMoon";
import {faGlobe} from "@fortawesome/free-solid-svg-icons/faGlobe";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons/faLocationDot";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import "../styles/Header.css";
import lightBackground from '../testPhotos/day.jpg';
import darkBackground from '../testPhotos/night.jpg';
import {faSun} from "@fortawesome/free-solid-svg-icons/faSun";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";

const Header = ({ city }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);
    const [isExit, setIsExit] = useState(false);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [cityName, setCityName] = useState(city);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [languageModal, setLanguageModal] = useState(false);
    const location = useLocation();
    const { lng, setLanguage } = useContext(LanguageContext);

    const userId = localStorage.getItem('userId');

    const handleLoginClick = () => {
        const token = Cookies.get('token');
        if(!token)
            navigate("/login");
        else{
            navigate("/profile")
        }
        setIsMenuVisible(false);
    };

    const handleMessageClick = () => {
        navigate("/chats");
        setIsMenuVisible(false);
    };

    const handleLogoClick = () => {
        navigate("/");
        setIsMenuVisible(false);
    };

    const handleCityClick = () => {
        setUploadPhotoModal(true);
    };

    const handleCitySaveClick = () => {
        toast.success(translations[language]['Success'], {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'Success',
        });
        setCityName(Cookies.get("city"));
        setUploadPhotoModal(false);
    };

    const handleCalendarClick = () => {
        const token = Cookies.get('token');
        const role = localStorage.getItem('userRole');
        if(token === null || token === "")
            navigate("/login");
        else if(role === "executor")
            navigate("/calendar/full/edit");
        else
            navigate("/calendar/full")
        setIsMenuVisible(false);
    };

    const handleOrderClick = (checked) => {
        navigate("/orders");
        setIsMenuVisible(false);
    };

    const handleEditClick = () => {
        navigate("/edit-user");
        setIsMenuVisible(false);
    };

    const handleExitClick = async () => {
        setIsExit(true);
        try {
            await accountExit(navigate);
            navigate("/");
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            Cookies.remove('token');
            window.location.reload();
        } catch (error){
            const errorMessage = error.message || 'Failed to fetch data';
            if (!toast.isActive(errorMessage)) {
                toast.error(errorMessage, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: errorMessage,
                });
            }
            console.error('Error fetching data:', error);
        }finally {
            setIsExit(false);
        }
    }

    const handleMenuClick = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleLanguageClick = () => {
        setLanguageModal(true);
        //setIsMenuVisible(false);
    };

    const changeLanguage = (language) => {
        setLanguage(language);
    };

    return (
        <header className={`header ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="header-content">
                <div className="search-container">
                    <h1 className={`logo ${theme === 'dark' ? 'dark' : ''}`} onClick={handleLogoClick}>Chair</h1>
                </div>
                <div className="search-container">
                    <h3 className={`navigate ${theme === 'dark' ? 'dark' : ''}`} onClick={handleCalendarClick}>{translations[language]['calendar']}</h3>
                    <h3 className={`navigate ${theme === 'dark' ? 'dark' : ''}`} onClick={handleOrderClick}>{translations[language]['orders']}</h3>
                    <h3 className={`navigate ${theme === 'dark' ? 'dark' : ''}`} onClick={handleMessageClick}>{translations[language]['messages']}</h3>
                </div>

                <div className="search-container">
                    <h3 style={{ cursor: "pointer" }} onClick={handleMenuClick}>
                        <FontAwesomeIcon
                            icon={faList}
                            flip="horizontal"
                            style={{
                                color: theme === 'dark' ? (isMenuVisible ? "#007bff" : "white") : (isMenuVisible ? "#007bff" : "#ad9a9a")
                            }}
                        />
                    </h3>
                </div>
            </div>
            <div className={`menu-overlay ${isMenuVisible ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="menu-content">
                    <h1 className={`logo ${theme === 'dark' ? 'dark' : ''}`} onClick={handleLogoClick}>Chair</h1>
                    <div>
                        <button
                            style={{width: "100%", display: "flex", justifyContent: "left", backgroundColor: "transparent", border: "none"}}
                            onClick={handleLoginClick}
                        >
                            <p style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>
                                <FontAwesomeIcon icon={faUser} flip="horizontal" style={{ marginRight: "10px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                                {translations[language]['profile']}
                            </p>
                        </button>
                        {userId != null &&
                            <div>
                                <button
                                    style={{width: "100%", display: "flex", justifyContent: "left", backgroundColor: "transparent", border: "none"}}
                                    onClick={handleEditClick}
                                >
                                    <p style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>
                                        <FontAwesomeIcon icon={faUserEdit} flip="horizontal" style={{ marginRight: "10px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                                        {translations[language]['profileEdit']}
                                    </p>
                                </button>
                                <button
                                    style={{width: "100%", display: "flex", justifyContent: "left", backgroundColor: "transparent", border: "none"}}
                                    onClick={handleExitClick}
                                >
                                    <p style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>
                                        <FontAwesomeIcon icon={faDoorOpen} flip="horizontal" style={{ marginRight: "10px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                                        {translations[language]['exit']}
                                    </p>
                                </button>
                            </div>
                        }
                        <button
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "left",
                                backgroundImage: `url(${theme === 'light' ? lightBackground : darkBackground})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                border: "none"
                            }}
                            onClick={toggleTheme}
                        >
                            <p style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>
                                {theme === 'light' ?
                                    <FontAwesomeIcon icon={faSun} flip="horizontal" style={{ marginRight: "10px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                                    :
                                    <FontAwesomeIcon icon={faMoon} flip="horizontal" style={{ marginRight: "10px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>}
                                {translations[language]['ClickToSChange']}
                            </p>
                        </button>
                        <button
                            style={{width: "100%", display: "flex", justifyContent: "left", backgroundColor: "transparent", border: "none"}}
                            onClick={handleLanguageClick}
                        >
                            <p style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>
                                <FontAwesomeIcon icon={faGlobe} flip="horizontal" style={{ marginRight: "10px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                                {translations[language]['ClickToLanguage']}
                            </p>
                        </button>
                        <button
                            style={{width: "100%", display: "flex", justifyContent: "left", backgroundColor: "transparent", border: "none"}}
                            onClick={handleCityClick}
                        >
                            <p style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>
                                <FontAwesomeIcon icon={faLocationDot} flip="horizontal" style={{ marginRight: "10px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                                {cityName}  ({translations[language]['ClickToSpecify']})
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            <div className={`extra-modal-overlay ${uploadPhotoModal ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="extra-modal-content">
                    <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                        <FontAwesomeIcon icon={faXmark} onClick={() => setUploadPhotoModal(false)} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                        <CitySelector/>
                    </div>
                    <div className="price-inputs">
                        <div className="input-group" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <button className="filter-button"
                                    onClick={handleCitySaveClick}><FontAwesomeIcon icon={faSave} /> {translations[language]['Save']}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`extra-modal-overlay ${languageModal? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="extra-modal-content">
                    <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                        <FontAwesomeIcon icon={faXmark} onClick={() => setLanguageModal(false)} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                        <select
                            value={lng} // Set the current language as selected
                            onChange={(e) => changeLanguage(e.target.value)}
                            className={`custom-select ${theme === 'dark' ? 'dark' : ''}`}
                        >
                            <option value="en">English</option>
                            <option value="ru">Русский</option>
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;