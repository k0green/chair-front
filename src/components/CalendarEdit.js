import React, {useContext, useEffect, useState} from 'react';
import '../styles/Calendar.css';
import { faChevronCircleLeft, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "./ThemeContext";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";

const Calendar = ({full}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDays, setSelectedDays] = useState([]);
    const [editingAppointmentId, setEditingAppointmentId] = useState(null);
    const [editedAppointments, setEditedAppointments] = useState({});
    const [isNewAppointment, setIsNewAppointment] = useState(false);
    const [newAppointmentData, setNewAppointmentData] = useState({
        procedure: "",
        startTime: "",
        sessionCount: 1,
        breakTime: "15",
        duration: "60",
        cost: "",
    });
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [servicesLookupData, setServicesLookupData] = useState([]);
    const { theme } = useContext(ThemeContext);
    let { id } = useParams();
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);

    useEffect(() => {
        fetchData();
    }, [currentMonth]);

    useEffect(() => {
        fetchLookupData();
    }, []);

    const fetchLookupData = async () => {
        try {
            const token = Cookies.get('token');
            if(!token)
                navigate("/login");
            else{
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await axios.get('http://localhost:5155/executor-service/executor-services/lookup', { withCredentials: true });
                const serverData = response.data.map(item => ({
                    id: item.id,
                    name: item.name
                }));
                setServicesLookupData(serverData);
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

    const fetchData = async () => {
        try {
            if(full)
            {
                const token = Cookies.get('token');
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await axios.get('http://localhost:5155/order/executor?month=' + (currentMonth.getMonth() + 1) +'&year=' + currentMonth.getFullYear(), { withCredentials: true });
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
            else{
                const token = Cookies.get('token');
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await axios.get(`http://localhost:5155/order/`+id + '?month=' + (currentMonth.getMonth() + 1) +'&year=' + currentMonth.getFullYear(), { withCredentials: true });
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

    const handleNewAppointmentSave = async () => {
        const newAppointments = [];
        for (const day of selectedDays) {
            const startTime = newAppointmentData.startTime;
            for (let i = 0; i < newAppointmentData.sessionCount; i++) {
                const newStartTime = addMinutes(startTime, i * (parseInt(newAppointmentData.duration) + parseInt(newAppointmentData.breakTime)));

                // Format date and duration
                const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, ...newStartTime.split(':'));

                // Explicitly set the timezone offset
                startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());

                const durationInMinutes = parseInt(newAppointmentData.duration);
                const endDate = new Date(startDate.getTime() + durationInMinutes * 60000);
                const appointmentData = {
                    executorServiceId: newAppointmentData.procedure,
                    starDate: startDate.toISOString(),
                    duration: endDate.toISOString(),
                    executorComment: "string",
                    price: parseFloat(newAppointmentData.cost), // convert cost to float
                };
                newAppointments.push(appointmentData);
            }
        }

        try {
            // Send a POST request to the backend endpoint
            const response = await axios.post('http://localhost:5155/order/add', newAppointments);

            // Handle the response, e.g., show a success message
            console.log('Data saved successfully', response.data);
            await fetchData();
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
            console.error('Error saving data', error);
        }

        setAppointmentsData([...appointmentsData, ...newAppointments]);
        setIsNewAppointment(false);
    };

    const handleEditClick = (appointment) => {
        setEditingAppointmentId(appointment.id);
        setEditedAppointments({ ...editedAppointments, [appointment.id]: { ...appointment } });
    };

    const handleDeleteClick = async (appointment) => {
        try {
            // Send a DELETE request to the backend endpoint
            await axios.delete(`http://localhost:5155/order/remove/${appointment.id}`);

            // Handle the response, e.g., show a success message
            console.log('Data deleted successfully');

            // Remove the deleted appointment from the local state
            const updatedAppointmentsData = appointmentsData.filter((item) => item.id !== appointment.id);
            setAppointmentsData(updatedAppointmentsData);

            // Clear the editing state
            setEditingAppointmentId(null);
            setEditedAppointments({});
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

    const handleSaveClick = async () => {
        if (editingAppointmentId !== null) {
            const updatedAppointmentsData = appointmentsData.map((appointment) => {
                if (appointment.id === editingAppointmentId) {
                    return {
                        ...appointment,
                        ...editedAppointments[editingAppointmentId],
                    };
                }
                return appointment;
            });

            try {
                const updatedAppointment = updatedAppointmentsData.find(appointment => appointment.id === editingAppointmentId);

                // Send a PUT or PATCH request to update the appointment on the server
                await axios.put(`http://localhost:5155/order/update`, updatedAppointment);

                // Handle the response, e.g., show a success message
                console.log('Data updated successfully');
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
                console.error('Error updating data', error);
            }

            setAppointmentsData(updatedAppointmentsData);
        }
        setEditingAppointmentId(null);
        setIsNewAppointment(false);
    };


    const handleDayClick = (day) => {
        if (isNewAppointment) {
            if (selectedDays.includes(day)) {
                setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
            } else {
                setSelectedDays([...selectedDays, day]);
            }
        } else {
            setSelectedDays([day]);
            setEditedAppointments({});
            setIsNewAppointment(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: lastDay }, (_, i) => i + 1);
    };

    const renderDaysOfWeek = () => {
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
                            style={{ color: "gray", backgroundColor: "transparent"  }}
                        />
                    </button>
                </div>
                <div className="daysOfWeek">{renderDaysOfWeek()}</div>
                <div className={`daysContainer ${theme === 'dark' ? 'dark' : ''}`}>
                    {emptyDays}
                    {daysInMonth.map((day, index) => {
                        const hasAppointments = appointmentsData.some(appointment => appointment.day === day);
                        return (
                            <div
                                key={index}
                                className={`day ${theme === 'dark' ? 'dark' : ''} ${selectedDays.includes(day) ? "selectedDay" : `${hasAppointments ? "hasAppointments" : ""}`}`}
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

    const handleInputChange = (e, appointmentId) => {
        const { name, value } = e.target;
        setEditedAppointments({
            ...editedAppointments,
            [appointmentId]: {
                ...editedAppointments[appointmentId],
                [name]: value,
            },
        });
    };

    const handleNewAppointmentClick = () => {
        setIsNewAppointment(true);
        setSelectedDays([]);
        setNewAppointmentData({
            procedure: "",
            startTime: "",
            sessionCount: 1,
            breakTime: "15",
            duration: "60",
            cost: "",
        });
    };

    const handleNewAppointmentCancel = () => {
        setIsNewAppointment(false);
        setSelectedDays([]);
    };

    const addMinutes = (time, minutes) => {
        const [hours, oldMinutes] = time.split(':').map(Number);
        const newMinutes = oldMinutes + minutes;
        const newHours = hours + Math.floor(newMinutes / 60);
        const finalHours = newHours < 10 ? `0${newHours}` : `${newHours}`;
        const finalMinutes = newMinutes % 60 < 10 ? `0${newMinutes % 60}` : `${newMinutes % 60}`;
        return `${finalHours}:${finalMinutes}`;
    };

    const renderNewAppointmentForm = () => {
        if (isNewAppointment) {
            return (
            <div className="appointmentAddContainer">
                <div className="appointmentAdd">
                    <div className="appointmentAdd-details">
                        <div>
                            {
                                <select
                                    name="procedure"
                                    className={`select ${theme === 'dark' ? 'dark' : ''}`}
                                    value={newAppointmentData.procedure}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, procedure: e.target.value })}
                                >
                                    <option value="">Выберите услугу</option>
                                    {servicesLookupData.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                            }
                        </div>
                        <div className="add-element">
                            Время начала:{" "}
                            {
                                <input
                                    type="time"
                                    name="starDate"
                                    placeholder={translations[language]['StartTime']}
                                    style={{width: "auto"}}
                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                    value={newAppointmentData.starDate}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, startTime: e.target.value })}
                                />
                            }
                        </div>
                        <div className="add-element">
                            Количество сеансов:{" "}
                            {
                                <input
                                    type="number"
                                    name="sessionCount"
                                    style={{width: "8ch"}}
                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                    placeholder={translations[language]['NumberOfSessions']}
                                    value={newAppointmentData.sessionCount}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, sessionCount: e.target.value })}
                                />
                            }
                        </div>
                        <div className="add-element">
                            Время перерыва:{" "}
                            {
                                <input
                                    type="number"
                                    name="breakTime"
                                    style={{width: "8ch"}}
                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                    placeholder={translations[language]['BreakTime']}
                                    value={newAppointmentData.breakTime}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, breakTime: e.target.value })}
                                />
                            }
                            {" "}мин
                        </div>
                        <div className="add-element">
                            Продолжительность:{" "}
                            {
                                <input
                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                    type="number"
                                    name="duration"
                                    style={{width: "8ch"}}
                                    placeholder={translations[language]['Duration']}
                                    value={newAppointmentData.duration}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, duration: e.target.value })}
                                />
                            }
                            {" "}мин
                        </div>
                        <div className="add-element">
                            Стоимость:{" "}
                            {
                                <input
                                    type="number"
                                    name="cost"
                                    style={{width: "8ch"}}
                                    placeholder={translations[language]['Cost']}
                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                    value={newAppointmentData.cost}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, cost: e.target.value })}
                                />
                            }
                            {" "}б.р.
                        </div>
                    </div>
                    {
                        <div>
                            <button className="save" onClick={handleNewAppointmentSave}>{translations[language]['Save']}</button>
                            <button className="cancel" onClick={handleNewAppointmentCancel}>{translations[language]['Cancel']}</button>
                        </div>
                    }
                </div>
            </div>
            );
        }
        return (
            <button className="newAppointmentButton" onClick={handleNewAppointmentClick}>
                {translations[language]['Add']}
            </button>
        );
    };

    const renderAppointments = () => {
        if (selectedDays.length > 0) {
            const appointments = appointmentsData.filter((appointment) => selectedDays.includes(appointment.day));
            if (appointments.length > 0) {
                return (
                    <div>
                        {appointments.map((appointment, index) => (
                            <div key={index} className="appointmentContainer">
                                <div className={`appointment ${theme === 'dark' ? 'dark' : ''}`}>
                                    <div className="appointment-details">
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>
                                            {translations[language]['Name']}:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <select
                                                    name="procedure"
                                                    className={`select ${theme === 'dark' ? 'dark' : ''}`}
                                                    value={appointment.executorServiceId}
                                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, procedure: e.target.value })}
                                                >
                                                    <option value="">Выберите услугу</option>
                                                    {servicesLookupData.map((service) => (
                                                        <option key={service.id} value={service.id}>
                                                            {service.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <strong>{appointment.serviceTypeName}</strong>
                                            )}
                                        </div>
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>
                                            {translations[language]['StartTime']}:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    name="starDate"
                                                    value={editedAppointments[appointment.id]?.starDate || ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{formatTime(appointment.starDate)}</strong>
                                            )}
                                        </div>
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>
                                            {translations[language]['Duration']}:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    name="duration"
                                                    value={editedAppointments[appointment.id]?.duration || ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{formatTime(appointment.duration)}</strong>
                                            )}
                                        </div>
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>
                                            {translations[language]['Cost']}:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    name="price"
                                                    value={editedAppointments[appointment.id]?.price || ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{appointment.price} byn</strong>
                                            )}
                                        </div>
                                    </div>
                                    {editingAppointmentId === appointment.id ? (
                                        <button className="save" onClick={handleSaveClick}>{translations[language]['Save']}</button>
                                    ) : (
                                        <div>
                                            {appointment.clientId == null &&
                                                <div>
                                                    <button className="edit" onClick={() => handleEditClick(appointment)}>{translations[language]['Edit']}</button>
                                                    <button className="delete" onClick={() => handleDeleteClick(appointment)}>{translations[language]['Delete']}</button>
                                                </div>
                                            }
                                        </div>
                                    )}
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
            <div className="newAppointmentContainer">
                {renderNewAppointmentForm()}
            </div>
            <div>
                {renderAppointments()}
            </div>
        </div>
    );
};

export default Calendar;