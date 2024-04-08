import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch, faUser} from "@fortawesome/free-solid-svg-icons";
import React, {useContext} from "react";
import "../styles/Header.css";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import moon from '../icons/moon.png';
import sun from '../icons/sun.png';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);

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
    };

    const handleOrderClick = (checked) => {
        navigate("/orders");
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
                </div>
            </div>
        </header>
    );
};

export default Header;