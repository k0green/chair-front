import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Footer from '../components/Footer';
import Header from '../components/Header';
import "../styles/Main.css";
import Calendar from '../components/Calendar';
import Orders from "../components/Orders";

const HomePage = ({ user, onLogout, full }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Header user={user} onLogout={onLogout} />
            <div>
                <Orders/>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;