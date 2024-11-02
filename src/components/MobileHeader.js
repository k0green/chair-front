import {useLocation, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDoorOpen, faUser, faUserEdit} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useState} from "react";
import "../styles/Header.css";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import lightBackground from '../testPhotos/day.jpg';
import darkBackground from '../testPhotos/night.jpg';
import sun from '../testPhotos/sun-solid.svg';
import {toast} from "react-toastify";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {accountExit} from "./api";
import CitySelector from "./CitySelector";
import {faSave} from "@fortawesome/free-solid-svg-icons/faSave";
import {faHome} from "@fortawesome/free-solid-svg-icons/faHome";
import {faMessage} from "@fortawesome/free-solid-svg-icons/faMessage";
import {faClipboard} from "@fortawesome/free-solid-svg-icons/faClipboard";
import {faCalendarDays} from "@fortawesome/free-solid-svg-icons/faCalendarDays";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons/faLocationDot";
import {faMoon} from "@fortawesome/free-solid-svg-icons/faMoon";
import {faSun} from "@fortawesome/free-solid-svg-icons/faSun";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faGlobe} from "@fortawesome/free-solid-svg-icons/faGlobe";
import Select from "react-select";

const MobileHeader = ({ city }) => {
    const navigate = useNavigate();
    const {theme, toggleTheme} = useContext(ThemeContext);
    const {language, translations} = useContext(LanguageContext);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [languageModal, setLanguageModal] = useState(false);
    const [cityName, setCityName] = useState(city || translations[language]['YourCity']);
    const location = useLocation();
    const { lng, setLanguage } = useContext(LanguageContext);

    const changeLanguage = (language) => {
        setLanguage(language);
    };

    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');

    const getIconStyle = (path) => ({
        color: location.pathname === path ? "#007bff" : (theme === 'dark' ? "white" : "#ad9a9a"),
    });

    const handleLoginClick = () => {
        const token = Cookies.get('token');
        if (!token)
            navigate("/login");
        navigate("/profile")
        setIsMenuVisible(!isMenuVisible);
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
        //setIsMenuVisible(false);
    };

    const handleLanguageClick = () => {
        setLanguageModal(true);
        //setIsMenuVisible(false);
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

        if (token === null || token === "")
            navigate("/login");
        if (role === "executor")
            navigate("/calendar/full/edit");
        else
            navigate("/calendar/full")
        setIsMenuVisible(false);
    };

    const handleOrderClick = () => {
        navigate("/orders");
        setIsMenuVisible(false);
    };

    const handleEditClick = () => {
        navigate("/edit-user");
        setIsMenuVisible(false);
    };

    const handleExitClick = () => {

        accountExit(navigate).then(() => {
            localStorage.removeItem('userName');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            Cookies.remove('token');
            navigate("/");
            window.location.reload()
        })
            .catch(error => {
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
            });
    }

    const handleMenuClick = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const languages = [
        { label: 'English', value: 'en' },
        { label: 'Русский', value: 'ru' },
    ];

    const customStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: theme === 'dark' ? '#252525' : '#ffffff',
            color: theme === 'dark' ? '#fff' : '#000000',
            borderColor: theme === 'dark' ? '#333333' : '#cccccc'
        }),
        singleValue: (styles) => ({
            ...styles,
            color: theme === 'dark' ? '#fff' : '#000000'
        }),
        placeholder: (styles) => ({
            ...styles,
            color: theme === 'dark' ? '#aaaaaa' : '#cccccc'
        }),
        menu: (styles) => ({
            ...styles,
            backgroundColor: theme === 'dark' ? '#252525' : '#ffffff',
            color: theme === 'dark' ? '#fff' : '#000000'
        }),
        option: (styles, { isFocused }) => ({
            ...styles,
            backgroundColor: isFocused ? (theme === 'dark' ? '#333333' : '#f0f0f0') : undefined,
            color: theme === 'dark' ? '#fff' : '#000000'
        }),
        input: (styles) => ({
            ...styles,
            color: theme === 'dark' ? '#ffffff' : '#000000' // Цвет вводимого текста
        })
    };

    return (
        <footer className={`app-footer-mobile ${theme === 'dark' ? 'dark' : ''}`}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
                <h3 style={{ cursor: "pointer" }} onClick={handleLogoClick}>
                    <FontAwesomeIcon icon={faHome} flip="horizontal" style={getIconStyle("/")} />
                </h3>
                <h3 style={{ cursor: "pointer" }} onClick={handleCalendarClick}>
                    <FontAwesomeIcon icon={faCalendarDays} flip="horizontal" style={role === "executor" ? getIconStyle("/calendar/full/edit") : getIconStyle("/calendar/full")} />
                </h3>
                <h3 style={{ cursor: "pointer" }} onClick={handleOrderClick}>
                    <FontAwesomeIcon icon={faClipboard} flip="horizontal" style={getIconStyle("/orders")} />
                </h3>
                <h3 style={{ cursor: "pointer" }} onClick={handleMessageClick}>
                    <FontAwesomeIcon icon={faMessage} flip="horizontal" style={getIconStyle("/chats")} />
                </h3>
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
        </footer>
    );
};

export default MobileHeader;