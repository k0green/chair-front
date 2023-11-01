import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Footer from '../components/Footer';
import Header from '../components/Header';
import "../styles/Main.css";
import Calendar from '../components/Calendar';

const HomePage = ({ user, onLogout, full }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Header user={user} onLogout={onLogout} />
            <div>
                <Calendar full={full} />
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;