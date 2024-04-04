import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";

const AppointmentsComponent = () => {
    const [appointmentsData, setAppointmentsData] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const navigate = useNavigate();
    const isExecutor = localStorage.getItem("userRole") === "executor";
    const { theme, toggleTheme } = useContext(ThemeContext);

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
            const userRole = localStorage.getItem('userRole');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const fetchData = async (url) => {
                const response = await axios.get(url, { withCredentials: true });
                const mapData = (data) => data.map(item => ({
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

                return {
                    byMaster: mapData(response.data.byMaster),
                    byClient: mapData(response.data.byClient),
                    forToday: mapData(response.data.forToday),
                    forWeek: mapData(response.data.forWeek)
                };
            }

            if (userRole === "executor") {
                const serverData = await fetchData('http://localhost:5155/order/unconfirmed/executor');
                setAppointmentsData(serverData);
            } else {
                const serverData = await fetchData('http://localhost:5155/order/unconfirmed/client');
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

    const handleApproveClick = (id) => {
        const token = Cookies.get('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get(`http://localhost:5155/order/approve/${id}?isExecutor=${isExecutor}`);
    };

    const renderAppointments = (filteredAppointments) => {
        if (filteredAppointments !== null && filteredAppointments.length > 0) {
            return (
                <div>
                    {filteredAppointments.map((appointment, index) => (
                        <div key={index} className="appointmentContainer">
                            <div className={`appointment ${theme === 'dark' ? 'dark' : ''}`}>
                                <div className="appointment-details">
                                    <div style={theme === 'dark' ? { color: "white"} : ''}>Название: <strong>{appointment.serviceTypeName}</strong> </div>
                                    <div style={theme === 'dark' ? { color: "white"} : ''}>Время начала: <strong>{formatTime(appointment.starDate)}</strong></div>
                                    <div style={theme === 'dark' ? { color: "white"} : ''}>Продолжительность: <strong>{formatTime(appointment.duration)}</strong></div>
                                    <div style={theme === 'dark' ? { color: "white"} : ''}>Стоимость: <strong>{appointment.price} byn</strong></div>
                                </div>
                                <button onClick={() => handleApproveClick(appointment.id)} disabled={isExecutor ? !appointment.clientId : !appointment.executorApprove}>Подтвердить запись</button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p>No appointments available for the selected date range.</p>;
        }
    };

    return (
        <div>
            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`}>Ожидают подтверждения от вас</div>
            {appointmentsData && renderAppointments(appointmentsData.byClient)}

            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`}>Ожидают подтверждения от мастера</div>
            {appointmentsData && renderAppointments(appointmentsData.byMaster)}

            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`}>Сегодняшние записи</div>
            {appointmentsData && renderAppointments(appointmentsData.forToday)}

            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`}>Записи на неделю</div>
            {appointmentsData && renderAppointments(appointmentsData.forWeek)}
        </div>
    );
};

export default AppointmentsComponent;
