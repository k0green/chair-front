import React, {useContext, useEffect, useState} from 'react';
import '../styles/Calendar.css';
import {
    faChevronCircleLeft,
    faChevronCircleRight,
    faChevronLeft,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify"; // Подключаем файл стилей

const Calendar = ({full}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentYear, setCurrentYear] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [appointmentsData, setAppointmentsData] = useState([]);
    const { theme, toggleTheme } = useContext(ThemeContext);
    let { id } = useParams();
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
        }
        fetchData();
    }, [currentMonth]);

    const fetchData = async () => {
        try {
            const token = Cookies.get('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            if (full){
                const response = await axios.get('http://localhost:5155/order/client?month=' + (currentMonth.getMonth() + 1) + '&year=' + currentMonth.getFullYear(), { withCredentials: true });
                const serverData = response.data.map(item => ({
                    executorServiceId: item.executorServiceId,
                    executorProfileName: item.executorProfileName,
                    executorName: item.executorName,
                    clientId: item.clientId,
                    clientName: item.clientName,
                    starDate: item.starDate,
                    day: item.day,
                    month: item.month,
                    duration: item.duration,
                    executorComment: item.executorComment,
                    clientComment: item.clientComment,
                    executorApprove: item.executorApprove,
                    clientApprove: item.clientApprove,
                    price: item.price,
                    serviceTypeName: item.serviceTypeName,
                    id: item.id
                }));
                setAppointmentsData(serverData);
            }
            else {
                const response = await axios.get(`http://localhost:5155/order/` + id + '?month=' + (currentMonth.getMonth() + 1) + '&year=' + currentMonth.getFullYear(), { withCredentials: true });
                const serverData = response.data.map(item => ({
                    executorServiceId: item.executorServiceId,
                    executorProfileName: item.executorProfileName,
                    executorName: item.executorName,
                    clientId: item.clientId,
                    clientName: item.clientName,
                    starDate: item.starDate,
                    day: item.day,
                    month: item.month,
                    duration: item.duration,
                    executorComment: item.executorComment,
                    clientComment: item.clientComment,
                    executorApprove: item.executorApprove,
                    clientApprove: item.clientApprove,
                    price: item.price,
                    serviceTypeName: item.serviceTypeName,
                    id: item.id
                }));
                setAppointmentsData(serverData);
            }
        } catch (error) {
            if (!toast.isActive(error.message)) {
                toast.error(error.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: error.message,
                });
            }
            console.error("Error fetching data:", error);
        }
    };

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const enrollButtonClick = (id) => {
        try {
            // Send a DELETE request to the backend endpoint
            axios.post(`http://localhost:5155/order/enroll/${id}`);

        } catch (error) {
            if (!toast.isActive(error.message)) {
                toast.error(error.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: error.message,
                });
            }
            console.error('Error deleting data', error);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: lastDay }, (_, i) => i + 1);
    };

    const renderDaysOfWeek = () => {
        //const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const daysOfWeek = [translations[language]['sun'], translations[language]['mon'], translations[language]['tue'], translations[language]['wed'], translations[language]['thu'], translations[language]['fri'], translations[language]['sat']];
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

    const renderAppointments = () => {
        if (selectedDay !== null) {
            const appointments = appointmentsData.filter(appointment => appointment.day === selectedDay);
            if (appointments.length > 0) {
                return (
                    <div>
                        {appointments.map((appointment, index) => (
                            <div key={index} className="appointmentContainer">
                                <div className={`appointment ${theme === 'dark' ? 'dark' : ''}`}>
                                    <div className="appointment-details">
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>{translations[language]['Name']}: <strong>{appointment.serviceTypeName}</strong> </div>
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>{translations[language]['StartTime']}: <strong>{formatTime(appointment.starDate)}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>{translations[language]['Duration']}: <strong>{formatTime(appointment.duration)}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>{translations[language]['Cost']}: <strong>{appointment.price} byn</strong></div>
                                    </div>
                                    {new Date(appointment.starDate) > new Date() &&
                                        <button style={{ backgroundColor: "transparent" }} onClick={()=>enrollButtonClick(appointment.id)}>{translations[language]['MakeAnAppointment']}</button>
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
