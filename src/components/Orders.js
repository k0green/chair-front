import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import {approveOrder, getOrders, registerQuery} from "./api";

const AppointmentsComponent = () => {
    const [appointmentsData, setAppointmentsData] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const navigate = useNavigate();
    const isExecutor = localStorage.getItem("userRole") === "executor";
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
        }
        fetchData();
    }, [currentMonth]);

    const fetchData = async () => {
        getOrders(navigate)
            .then(serverData => {
                setAppointmentsData(serverData);
            })
            .catch(error => {
                const errorMessage = error.message || 'Failed to fetch data';
                if (!toast.isActive(errorMessage)) {
                    toast.error(errorMessage, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        toastId: errorMessage,
                    });
                }
                console.error('Error fetching data:', error);
            });
    };

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleApproveClick = (id) => {
        approveOrder(navigate, id, isExecutor)
            .then(serverData => {
                setAppointmentsData(serverData);
            })
            .catch(error => {
                const errorMessage = error.message || 'Failed to fetch data';
                if (!toast.isActive(errorMessage)) {
                    toast.error(errorMessage, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        toastId: errorMessage,
                    });
                }
                console.error('Error fetching data:', error);
            });
    };

    const renderAppointments = (filteredAppointments) => {
        if (filteredAppointments !== null && filteredAppointments.length > 0) {
            return (
                <div>
                    {filteredAppointments.map((appointment, index) => (
                        <div key={index} className="appointmentContainer">
                            <div className={`appointment ${theme === 'dark' ? 'dark' : ''}`}>
                                <div className="appointment-details">
                                    <div style={theme === 'dark' ? { color: "white"} : { color: "black" }}>{translations[language]['Name']}: <strong>{appointment.serviceTypeName}</strong> </div>
                                    <div style={theme === 'dark' ? { color: "white"} : { color: "black" }}>{translations[language]['StartTime']}: <strong>{formatTime(appointment.starDate)}</strong></div>
                                    <div style={theme === 'dark' ? { color: "white"} : { color: "black" }}>{translations[language]['Duration']}: <strong>{formatTime(appointment.duration)}</strong></div>
                                    <div style={theme === 'dark' ? { color: "white"} : { color: "black" }}>{translations[language]['Cost']}: <strong>{appointment.price} byn</strong></div>
                                </div>
                                <button onClick={() => handleApproveClick(appointment.id)} disabled={isExecutor ? !appointment.clientId : !appointment.executorApprove}>{translations[language]['ApproveOrder']}</button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p>{translations[language]['NoAppointmentsAvailableForTheSelectedDateRange']}</p>;
        }
    };

    return (
        <div>
            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`}>{translations[language]['ByMaster']}</div>
            {appointmentsData && renderAppointments(appointmentsData.byClient)}

            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`}>{translations[language]['ByClient']}</div>
            {appointmentsData && renderAppointments(appointmentsData.byMaster)}

            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`}>{translations[language]['OrdersForADay']}</div>
            {appointmentsData && renderAppointments(appointmentsData.forToday)}

            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`}>{translations[language]['OrdersForAWeek']}</div>
            {appointmentsData && renderAppointments(appointmentsData.forWeek)}
        </div>
    );
};

export default AppointmentsComponent;
