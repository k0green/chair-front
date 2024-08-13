import React, { useContext, useEffect, useState } from 'react';
import '../styles/Calendar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft, faChevronCircleRight, faCheck, faClose, faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { ThemeContext } from "./ThemeContext";
import { LanguageContext } from "./LanguageContext";
import { enrollCalendar, getOrdersByRole, updateOrder } from "./api";

const Calendar = ({ full }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [appointmentsData, setAppointmentsData] = useState([]);
    const { theme, toggleTheme } = useContext(ThemeContext);
    let { id } = useParams();
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const [clientComment, setClientComment] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) {
                navigate('/login');
            } else {
                const serverData = await getOrdersByRole(navigate, full, currentMonth, id);
                setAppointmentsData(serverData);
            }
        };
        fetchData();
    }, [currentMonth, navigate, full, id]);

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const enrollButtonClick = async (appointment) => {
        await enrollCalendar(navigate, appointment.id);
        await updateOrder(navigate, clientComment);
        const serverData = await getOrdersByRole(navigate, full, currentMonth, id);
        setAppointmentsData(serverData);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: lastDay }, (_, i) => i + 1);
    };

    const renderDaysOfWeek = () => {
        const daysOfWeek = [
            translations[language]['sun'],
            translations[language]['mon'],
            translations[language]['tue'],
            translations[language]['wed'],
            translations[language]['thu'],
            translations[language]['fri'],
            translations[language]['sat']
        ];
        return daysOfWeek.map((day, index) => (
            <div key={index} className={`dayOfWeek ${theme === 'dark' ? 'dark' : ''}`}>{day}</div>
        ));
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => <div key={i} className="emptyDay" />);

        return (
            <div className={`calendar ${theme === 'dark' ? 'dark' : ''}`}>
                <div className={`monthNavigation ${theme === 'dark' ? 'dark' : ''}`}>
                    <button className="monthButton" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                        <FontAwesomeIcon
                            icon={faChevronCircleLeft}
                            className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                            style={{ color: "gray", backgroundColor: "transparent" }}
                        />
                    </button>
                    <div className={`currentMonth ${theme === 'dark' ? 'dark' : ''}`}>{currentMonth.toLocaleString(language, { month: 'long', year: 'numeric' })}</div>
                    <button className="monthButton" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                        <FontAwesomeIcon
                            icon={faChevronCircleRight}
                            className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                            style={{ color: "gray", backgroundColor: "transparent" }}
                        />
                    </button>
                </div>
                <div className="daysOfWeek">{renderDaysOfWeek()}</div>
                <div className="daysContainer">
                    {emptyDays}
                    {daysInMonth.map((day, index) => {
                        const hasAppointments = appointmentsData.some(appointment => appointment.day === day);
                        return (
                            <div
                                key={index}
                                className={`day ${theme === 'dark' ? 'dark' : ''} ${selectedDay === day ? "selectedDay" : `${hasAppointments ? "hasAppointments" : ""}`}`}
                                onClick={() => handleDayClick(day)}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const saveClientComment = async () => {
        await updateOrder(navigate, clientComment);
    }

    const renderAppointments = () => {
        if (selectedDay !== null) {
            const appointments = appointmentsData.filter(appointment => appointment.day === selectedDay);
            if (appointments.length > 0) {
                const userRole = localStorage.getItem('userRole');
                return (
                    <div>
                        {appointments.map((appointment, index) => (
                            <div key={index} className="appointmentContainer">
                                <div className={`appointment ${theme === 'dark' ? 'dark' : ''}`}>
                                    <div className="appointment-details">
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['Name']}: <strong>{appointment.serviceTypeName}</strong> </div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['StartTime']}: <strong>{formatTime(appointment.starDate)}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['Duration']}: <strong>{formatTime(appointment.duration)}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['Cost']}: <strong>{appointment.price} byn</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ExecutorComment']}: <strong>{appointment.executorComment}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ClientName']}: <strong>{appointment.clientName}</strong></div>
                                        {userRole === 'executor' ?
                                            <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ClientComment']}: <strong>{appointment.clientComment}</strong></div>
                                            :
                                            <div>
                                                {translations[language]['ExecutorComment']}:{" "}
                                                <input
                                                    type="text"
                                                    name="clientComment"
                                                    style={{ width: "18ch" }}
                                                    placeholder={translations[language]['ClientComment']}
                                                    className={`newAppointmentForm1-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    value={appointment.clientComment}
                                                    onChange={(e) => setClientComment({ ...appointment, clientComment: e.target.value })}
                                                />
                                                {full ?
                                                    <button onClick={() => saveClientComment()}>
                                                        <FontAwesomeIcon
                                                            icon={faSave}
                                                            style={{ color: "lightgreen", backgroundColor: "transparent" }}
                                                        />
                                                    </button>
                                                    : <></>}
                                            </div>
                                        }
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ExecutorApprove']}: <strong>{appointment.executorApprove ?
                                            <FontAwesomeIcon
                                                icon={faCheck}
                                                style={{ color: "lightgreen", backgroundColor: "transparent" }}
                                            />
                                            :
                                            <FontAwesomeIcon
                                                icon={faClose}
                                                style={{ color: "red", backgroundColor: "transparent" }}
                                            />} </strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ClientApprove']}: <strong>{appointment.clientApprove ?
                                            <FontAwesomeIcon
                                                icon={faCheck}
                                                style={{ color: "lightgreen", backgroundColor: "transparent" }}
                                            />
                                            :
                                            <FontAwesomeIcon
                                                icon={faClose}
                                                style={{ color: "red", backgroundColor: "transparent" }}
                                            />} </strong></div>
                                    </div>
                                    {new Date(appointment.starDate) > new Date() && !full &&
                                        <button style={{ backgroundColor: "transparent" }} onClick={() => enrollButtonClick(appointment)}>{translations[language]['MakeAnAppointment']}</button>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div>
            <div className={`calendarContainer ${theme === 'dark' ? 'dark' : ''}`}>
                {renderCalendar()}
            </div>
            <div>
                {renderAppointments()}
            </div>
        </div>
    );
};

export default Calendar;
