import React, { useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";
import "../styles/Main.css";
import Calendar from '../components/Calendar';

const CalendarPage = ({ user, onLogout, full }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <Calendar full={full} />
    );
};

export default CalendarPage;