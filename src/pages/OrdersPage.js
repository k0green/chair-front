import React, { useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";
import "../styles/Main.css";
import Orders from "../components/Orders";

const HomePage = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <Orders/>
            </div>
        </div>
    );
};

export default HomePage;