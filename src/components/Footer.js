import React, {useContext} from "react";
import '../styles/Footer.css'
import {ThemeContext} from "./ThemeContext";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LanguageContext} from "./LanguageContext";

const Footer = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { language, setLanguage } = useContext(LanguageContext);

    const changeLanguage = (language) => {
        setLanguage(language);
    };

    return (
        <footer className={`app-footer ${theme === 'dark' ? 'dark' : ''}`}>
            <p className="footer-text">© {new Date().getFullYear()} Chair Inc.</p>
            <div style={{position: 'absolute', right: '15px'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <select className="language-select" onChange={(e) => changeLanguage(e.target.value)}>
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                    </select>
                    <FontAwesomeIcon
                        icon={faGlobe}
                        style={{marginLeft: "25px",marginBottom: "2px", color: "#838383"}}
                    />
                </div>
            </div>
        </footer>
    );
};
export default Footer;
