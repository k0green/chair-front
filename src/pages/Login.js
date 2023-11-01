import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/Main.css";
import Login from '../components/Login';

const LoginPage = ({ user, onLogout }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <Login />
            </div>
        </div>
    );
};

export default LoginPage;