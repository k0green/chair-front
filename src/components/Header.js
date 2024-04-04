import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch, faMessage, faPerson, faUser} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useState} from "react";
import "../styles/Header.css";
import ThemeSwitcher from "./ThemeSwitcher";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [darkTheme, setDarkTheme] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

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
                    <h3 className={`navigate ${theme === 'dark' ? 'dark' : ''}`} onClick={handleCalendarClick}>Календарь</h3>
                    <h3 className={`navigate ${theme === 'dark' ? 'dark' : ''}`} onClick={handleOrderClick}>Заявки</h3>
                    <h3 className={`navigate ${theme === 'dark' ? 'dark' : ''}`} onClick={handleMessageClick}>Сообщения</h3>
                </div>

                <div className="search-container">
                    <button onClick={toggleTheme}>
                        {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
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