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

const MobileHeader = ({ city }) => {
    const navigate = useNavigate();
    const {theme, toggleTheme} = useContext(ThemeContext);
    const {language, translations} = useContext(LanguageContext);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [cityName, setCityName] = useState(city || translations[language]['YourCity']);
    const location = useLocation();

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
        setIsMenuVisible(false);
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
                            onClick={handleCityClick}
                        >
                            <p style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>
                                смена языка
                                <FontAwesomeIcon icon={faLocationDot} flip="horizontal" style={{ marginRight: "10px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                                {cityName}  ({translations[language]['ClickToSpecify']})
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

            {uploadPhotoModal && (
                <div className="filter-modal" >
                    <div className="modal-content" style={{maxWidth: "400px", maxHeight: "100px"}}>
                    <span className="close" onClick={() => setUploadPhotoModal(false)}>
                        &times;
                    </span>
                        <div className="dropzone-centrize">
                            <CitySelector/>
                            <button
                                className="dropzone-order-button"
                                onClick={handleCitySaveClick}
                            >
                                {<p className="order-text"><FontAwesomeIcon icon={faSave} /> {translations[language]['Save']}</p>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default MobileHeader;