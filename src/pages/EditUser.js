import React, { useContext } from "react";
import "../styles/Main.css";
import EditUser from '../components/EditUser';
import {ThemeContext} from "../components/ThemeContext";

const RegisterPage = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <EditUser />
            </div>
        </div>
    );
};

export default RegisterPage;