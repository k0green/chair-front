import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const AppointmentsComponent = () => {
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
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
            const userRole = localStorage.getItem('userRole');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            let response;
            if (userRole === "executor") {
                response = await axios.get('http://localhost:5155/order/unconfirmed/executor', { withCredentials: true });
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
            } else {
                response = await axios.get('http://localhost:5155/order/unconfirmed/client', { withCredentials: true });
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

    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const todayAppointments = appointmentsData.filter(item => {
        const appointmentDate = new Date(item.starDate);
        return (
            appointmentDate.getDate() === today.getDate() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear()
        );
    });

    const nextSevenDaysAppointments = appointmentsData.filter(item => {
        const appointmentDate = new Date(item.starDate);
        return appointmentDate >= today && appointmentDate <= sevenDaysLater;
    });

    const nextThirtyDaysAppointments = appointmentsData.filter(item => {
        const appointmentDate = new Date(item.starDate);
        return appointmentDate >= today && appointmentDate <= thirtyDaysLater;
    });

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const renderAppointments = (filteredAppointments) => {
        if (filteredAppointments.length > 0) {
            return (
                <div>
                    {filteredAppointments.map((appointment, index) => (
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
        } else {
            return <p>No appointments available for the selected date range.</p>;
        }
    };

    return (
        <div>
            <div className="tab">Сегодня</div>
            {renderAppointments(todayAppointments)}

            <div className="tab">Следующие 7 дней</div>
            {renderAppointments(nextSevenDaysAppointments)}

            <div className="tab">Следующие 30 дней</div>
            {renderAppointments(nextThirtyDaysAppointments)}
        </div>
    );
};

export default AppointmentsComponent;
