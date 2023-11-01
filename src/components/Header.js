import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch, faMessage, faPerson, faUser} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import "../styles/Header.css";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [darkTheme, setDarkTheme] = useState(false);

    const handleLoginClick = () => {
        navigate("/login");
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
        const token = localStorage.getItem('token');
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
        <header className="header">
            <div className="header-content">
                <div className="search-container">
                <h1 className="logo" onClick={handleLogoClick}>Chair</h1>
                </div>
                <div className="search-container">
                    <h3 className="navigate" onClick={handleCalendarClick}>Календарь</h3>
                {/*<h3 className="logo" onClick={handleLogoClick}>Заявки(в этом разделе будут подтвержденные неподтвержденные выбираться будут через как у нас в ерп при импорте и так же там будт на неделю на сегодня на 30 дней)</h3>*/}
                    <h3 className="navigate" onClick={handleOrderClick}>Заявки</h3>
                    <h3 className="navigate" onClick={handleMessageClick}>Сообщения</h3>
                </div>

                <div className="search-container">
                    <ThemeSwitcher />
{/*                    <div className="search-input-container">
                        <input type="text" placeholder="Поиск" className="search-input" />
                        <button className="search-button" onClick={handleSearchClick}>
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        </button>
                    </div>*/}
                    <button className="profile-header-button" onClick={handleSearchClick}>
                        <FontAwesomeIcon icon={faSearch} flip="horizontal" style={{color: "#000",}} />
                    </button>
                    <button className="profile-header-button" onClick={handleLoginClick}>
                        <FontAwesomeIcon icon={faUser} flip="horizontal" style={{color: "#000",}} />
                    </button>
{/*                    <button className="settings-button" onClick={handleMessageClick}>
                        <FontAwesomeIcon icon={faMessage} flip="horizontal" style={{color: "#000000",}} />
                    </button>*/}
                </div>
            </div>
        </header>
    );
};

export default Header;