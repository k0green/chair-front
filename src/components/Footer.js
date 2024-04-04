import React, {useContext} from "react";
import '../styles/Footer.css'
import {ThemeContext} from "./ThemeContext";

const Footer = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <footer className={`app-footer ${theme === 'dark' ? 'dark' : ''}`}>
            <p className="footer-text">© {new Date().getFullYear()} Chair Inc.</p>
        </footer>
    );
};

export default Footer;
