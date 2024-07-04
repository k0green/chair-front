import React, { useContext } from "react";
import "../styles/Main.css";
import Register from '../components/Register';
import {ThemeContext} from "../components/ThemeContext";

const RegisterPage = () => {
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