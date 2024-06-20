import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDoorOpen, faSearch, faUser, faUserEdit} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useState} from "react";
import "../styles/Header.css";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import moon from '../icons/moon.png';
import sun from '../icons/sun.png';
import axios from "axios";
import {toast} from "react-toastify";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {faClose} from "@fortawesome/free-solid-svg-icons/faClose";

const MobileHeader = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);
        const [isMenuVisible, setIsMenuVisible] = useState(false);

    const userId = localStorage.getItem('userId');
    const handleLoginClick = () => {
        const token = Cookies.get('token');
        if(!token)
            navigate("/login");
        navigate("/profile")
    };

    const handleMessageClick = () => {
        navigate("/chats");
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleSearchClick = () => {
        /*request*/
    };

    const handleCalendarClick = () => {
        const token = Cookies.get('token');
        const role = localStorage.getItem('userRole');
        if(token === null || token === "")
            navigate("/login");
        if(role === "executor")
            navigate("/calendar/full/edit");
        else
            navigate("/calendar/full")
        setIsMenuVisible(!isMenuVisible);
    };

    const handleOrderClick = (checked) => {
        navigate("/orders");
        setIsMenuVisible(!isMenuVisible);
    };

    const handleEditClick = () => {
        navigate("/edit-user");
        setIsMenuVisible(!isMenuVisible);
    };

    const handleExitClick = () => {
        const token = Cookies.get('token');
        if (!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.post(`http://localhost:5155/account/logout`)
                .then(responce => {
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userId');
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('userRole');
                    Cookies.remove('token');
                    navigate("/");
                    window.location.reload()
                })
                .catch(error => {
                    if (!toast.isActive(error.message)) {
                        toast.error(error.message, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            toastId: error.message,
                        });
                    }
                    if (error.response) {
                        if (error.response.status === 401) {
                            navigate("/login");
                        } else {
                            console.error(`Ошибка от сервера: ${error.response.status}`);
                        }
                    } else if (error.request) {
                        console.error('Ответ не был получен. Возможно, проблемы с сетью.');
                    } else {
                        console.error('Произошла ошибка при настройке запроса:', error.message);
                    }
                });
        }
    }

    const handleMenuClick = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    return (
        <header className={`header ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="header-content">
                <div className="search-container">
                    <h1 className={`logo ${theme === 'dark' ? 'dark' : ''}`} onClick={handleLogoClick}>Chair</h1>
                </div>

                <div className="search-container">
                    <button style={{ backgroundColor: "transparent", border: "none" }} onClick={toggleTheme}>
                        {theme === 'light' ?
                            <img src={moon} style={{ width: '60%', height: '60%' }} />
                            :
                            <img src={sun} style={{ width: '70%', height: '70%', marginRight: "10px" }} />}
                    </button>
                    <button className={`profile-header-button ${theme === 'dark' ? 'dark' : ''}`} onClick={handleLoginClick}>
                        <FontAwesomeIcon icon={faUser} flip="horizontal" style={theme === 'dark' ? { color: "white" } : { color: "#000" }} />
                    </button>
                    {userId != null &&
                        <div>
                            <button className={`profile-header-button ${theme === 'dark' ? 'dark' : ''}`} onClick={handleEditClick}>
                                <FontAwesomeIcon icon={faUserEdit} flip="horizontal" style={theme === 'dark' ? { color: "white" } : { color: "#000" }} />
                            </button>
                            <button className={`profile-header-button ${theme === 'dark' ? 'dark' : ''}`} onClick={handleExitClick}>
                                <FontAwesomeIcon icon={faDoorOpen} flip="horizontal" style={theme === 'dark' ? { color: "white" } : { color: "#000" }} />
                            </button>
                        </div>
                    }
                    <button className={`profile-header-button ${theme === 'dark' ? 'dark' : ''}`} onClick={handleMenuClick}>
                        {isMenuVisible ? <FontAwesomeIcon icon={faClose} flip="horizontal" style={theme === 'dark' ? { color: "white",  } : { color: "#000" }} />
                        : <FontAwesomeIcon icon={faList} flip="horizontal" style={theme === 'dark' ? { color: "white" } : { color: "#000" }} />}
                    </button>
                </div>
            </div>

            <div className={`menu-overlay ${isMenuVisible ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="menu-content">
                    <div>
                        <h3 className={`navigate-mobile ${theme === 'dark' ? 'dark' : ''}`} onClick={handleCalendarClick}>{translations[language]['calendar']}</h3>
                        <h3 className={`navigate-mobile ${theme === 'dark' ? 'dark' : ''}`} onClick={handleOrderClick}>{translations[language]['orders']}</h3>
                        <h3 className={`navigate-mobile ${theme === 'dark' ? 'dark' : ''}`} onClick={handleMessageClick}>{translations[language]['messages']}</h3>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MobileHeader;