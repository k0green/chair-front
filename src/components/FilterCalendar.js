import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";

const FilterCalendar = ({ onDateChange, selectedDates }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { theme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);

    const handleDayClick = (day) => {
        console.log(day);
        console.log(selectedDates);
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onDateChange(selectedDate);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => i + 1);
    };

    const renderDaysOfWeek = () => (
        ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day, i) => (
            <div key={i} className={`dayOfWeek ${theme === 'dark' ? 'dark' : ''}`}>
                {translations[language][day]}
            </div>
        ))
    );

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => <div key={i} className="emptyDay" />);

        return (
            <div className={`calendar ${theme === 'dark' ? 'dark' : ''}`}>
                <div className={`monthNavigation ${theme === 'dark' ? 'dark' : ''}`}>
                    <button
                        className="monthButton"
                        onClick={() => {
                            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
                        }}>
                        <FontAwesomeIcon
                            icon={faChevronCircleLeft}
                            className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                            style={{ color: "gray", backgroundColor: "transparent" }}
                        />
                    </button>

                    <div className={`currentMonth ${theme === 'dark' ? 'dark' : ''}`}>
                        {currentMonth.toLocaleString(language, { month: 'long', year: 'numeric' })}
                    </div>

                    <button
                        className="monthButton"
                        onClick={() => {
                            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
                        }}>
                        <FontAwesomeIcon
                            icon={faChevronCircleRight}
                            className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                            style={{ color: "gray", backgroundColor: "transparent" }}
                        />
                    </button>
                </div>
                <div className="daysOfWeek">{renderDaysOfWeek()}</div>
                <div className={`daysContainer ${theme === 'dark' ? 'dark' : ''}`}>
                    {emptyDays}
                    {daysInMonth.map((day, index) =>
                    {
                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const isSelected = selectedDates.some(selectedDate => date.getDate() === new Date(selectedDate).getDate() && date.getMonth() === new Date(selectedDate).getMonth() && date.getFullYear() === new Date(selectedDate).getFullYear() );
                        return (
                            <div
                                key={index}
                                className={`day ${theme === 'dark' ? 'dark' : ''} ${isSelected ? "selectedDay" : ''}`}
                                onClick={() => handleDayClick(day)} >
                                {day}
                            </div> ); })}
                </div>
            </div>
        );
    };

    return (
        <div className={`calendarContainer ${theme === 'dark' ? 'dark' : ''}`}>
            {renderCalendar()}
        </div>
    );
};

export default FilterCalendar;