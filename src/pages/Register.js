import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/Main.css";
import Register from '../components/Register';

const RegisterPage = ({ user, onLogout }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <Register />
            </div>
        </div>
    );
};

export default RegisterPage;