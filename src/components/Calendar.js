import React, {useContext, useEffect, useState} from 'react';
import '../styles/Calendar.css';
import {
    faChevronCircleLeft,
    faChevronCircleRight,
    faChevronLeft,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ThemeContext} from "../context/ThemeContext";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Подключаем файл стилей

const Calendar = ({full}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentYear, setCurrentYear] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [appointmentsData, setAppointmentsData] = useState([]);
    const { theme } = useContext(ThemeContext);
    // Здесь нужно будет добавить логику запроса для получения данных о записях на сервере
    let { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from the backend when the component mounts or currentMonth changes
        const token = Cookies.get('token');
        if (!token) {
            // Редирект на страницу входа
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
            console.error("Error fetching data:", error);
        }
    };

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    // Пример данных о записях
    /*const appointmentsData = [
        {
            day: 3,
            procedure: 'Процедура 1',
            start: '18:00',
            duration: '1 час',
            cost: '100',
        },
        {
            day: 3,
            procedure: 'Процедура 3',
            start: '18:00',
            duration: '1 час',
            cost: '200',
        },
        {
            day: 10,
            procedure: 'Процедура 2',
            start: '18:00',
            duration: '2 часа',
            cost: '150',
        },
        // ...другие записи
    ];*/

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: lastDay }, (_, i) => i + 1);
    };

    const renderDaysOfWeek = () => {
        const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        return daysOfWeek.map((day, index) => (
            <div key={index} className="dayOfWeek">{day}</div>
        ));
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => <div key={i} className="emptyDay" />);

        return (
            <div className="calendar">
                <div className="monthNavigation">
                    <button className="monthButton" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                        <FontAwesomeIcon
                            icon={faChevronCircleLeft}
                            className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                            style={{ color: "gray" }}
                        />
                    </button>
                    <div className="currentMonth">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                    <button className="monthButton" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                        <FontAwesomeIcon
                            icon={faChevronCircleRight}
                            className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                            style={{ color: "gray" }}
                        />
                    </button>
                </div>
                <div className="daysOfWeek">{renderDaysOfWeek()}</div>
                <div className="daysContainer">
                    {emptyDays}
                    {daysInMonth.map((day, index) => (
                        <div key={index} className={`day ${selectedDay === day ? "selectedDay" : ""}`} onClick={()=> handleDayClick(day)}>
                            {day}
                        </div>
                    ))}
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
                                <div className="appointment">
                                    <div className="appointment-details">
                                        <div>Название: <strong>{appointment.serviceTypeName}</strong> </div>
                                        <div>Время начала: <strong>{formatTime(appointment.starDate)}</strong></div>
                                        <div>Продолжительность: <strong>{formatTime(appointment.duration)}</strong></div>
                                        <div>Стоимость: <strong>{appointment.price} byn</strong></div>
                                    </div>
                                    <button>Записаться</button>
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
            <div className="calendarContainer">
                {renderCalendar()}
            </div>
            <div>
                {renderAppointments()}
            </div>
        </div>
    );
};

export default Calendar;
