import React from "react";
import "../styles/Main.css";
import Calendar from '../components/Calendar';

const CalendarPage = ({ user, onLogout, full }) => {
    return (
        <Calendar full={full} />
    );
};

export default CalendarPage;