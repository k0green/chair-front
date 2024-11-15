import React, { useContext } from "react";
import { ThemeContext } from '../components/ThemeContext';
import "../styles/Main.css";
import Login from '../components/Login';

const LoginPage = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div>
            <div className={`login-container ${theme === 'light' ? 'main-light-theme' : 'main-dark-theme'}`}>
                <Login />
            </div>
        </div>
    );
};

export default LoginPage;