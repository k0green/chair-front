import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";

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
        try {
            const token = Cookies.get('token');
            const userRole = localStorage.getItem('userRole');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const fetchData = async (url) => {
                const response = await axios.get(url, { withCredentials: true });
                try{
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
                        byMaster: mapData(userRole === "executor" ? response.data.byMaster : response.data.byClient),
                        byClient: mapData(userRole === "executor" ? response.data.byClient : response.data.byMaster),
                        forToday: mapData(response.data.forToday),
                        forWeek: mapData(response.data.forWeek)
                    };
                }
                catch (error){
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
                }
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
        console.log(filteredAppointments);
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
