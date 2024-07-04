import React, { useContext } from "react";
import "../styles/Chat.css";
import Chat from '../components/Chat';
import {ThemeContext} from "../components/ThemeContext";

const HomePage = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <Chat />
            </div>
        </div>
    );
};

export default HomePage;