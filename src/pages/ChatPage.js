import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Footer from '../components/Footer';
import Header from '../components/Header';
import "../styles/Chat.css";
import Chat from '../components/Chat';

const HomePage = ({ user, onLogout }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Header user={user} onLogout={onLogout} />
            <div>
                <Chat />
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;