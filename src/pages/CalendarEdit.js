import React, { useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";
import "../styles/Main.css";
import CalendarEdit from "../components/CalendarEdit";

const HomePage = ({ full }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <CalendarEdit full={full}/>
            </div>
        </div>
    );
};

export default HomePage;