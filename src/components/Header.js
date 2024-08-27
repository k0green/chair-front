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
import {toast} from "react-toastify";
import {accountExit} from "./api";

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);
    const [isExit, setIsExit] = useState(false);

    const userId = localStorage.getItem('userId');
    const token = Cookies.get('token');
    const handleLoginClick = () => {
        const token = Cookies.get('token');
        if(!token)
            navigate("/login");
        else{
            navigate("/profile")
        }
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
        else if(role === "executor")
            navigate("/calendar/full/edit");
        else
            navigate("/calendar/full")
    };

    const handleOrderClick = (checked) => {
        navigate("/orders");
    };

    const handleEditClick = () => {
        navigate("/edit-user");
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
                    <button style={{ backgroundColor: "transparent", border: "none" }} onClick={toggleTheme}>
                        {theme === 'light' ?
                            <img
                                src={moon}
                                style={{ width: '60%', height: '60%' }}
                            />
                            :
                            <img
                                src={sun}
                                style={{ width: '70%', height: '70%', marginRight: "10px" }}
                            />}
                    </button>
                    <button className={`profile-header-button ${theme === 'dark' ? 'dark' : ''}`} onClick={handleSearchClick}>
                        <FontAwesomeIcon icon={faSearch} flip="horizontal" style={theme === 'dark' ? {color: "white"} : {color: "#000",}} />
                    </button>
                    <button className={`profile-header-button ${theme === 'dark' ? 'dark' : ''}`} onClick={handleLoginClick}>
                        <FontAwesomeIcon icon={faUser} flip="horizontal" style={theme === 'dark' ? {color: "white"} : {color: "#000",}} />
                    </button>
                    {token != null && userId != null &&
                        <div>
                            <button className={`profile-header-button ${theme === 'dark' ? 'dark' : ''}`} onClick={handleEditClick}>
                                <FontAwesomeIcon icon={faUserEdit} flip="horizontal" style={theme === 'dark' ? {color: "white"} : {color: "#000",}} />
                            </button>
                            <button className={`profile-header-button ${theme === 'dark' ? 'dark' : ''}`} onClick={handleExitClick} disabled={isExit}>
                                <FontAwesomeIcon icon={faDoorOpen} flip="horizontal" style={theme === 'dark' ? {color: "white"} : {color: "#000",}} />
                            </button>
                        </div>
                    }
                </div>
            </div>
        </header>
    );
};

export default Header;