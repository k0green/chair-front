import React, {useContext, useEffect, useState} from 'react';
import '../styles/Calendar.css';
import { faChevronCircleLeft, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../context/ThemeContext";
import { v4 as uuidv4 } from 'uuid';
import {useParams} from "react-router-dom";
import axios from "axios";

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
    const { theme } = useContext(ThemeContext);
    let { id } = useParams();

    useEffect(() => {
        // Fetch data from the backend when the component mounts or currentMonth changes
        fetchData();
    }, [currentMonth]);

    const fetchData = async () => {
        try {
            if(full)
            {
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
            console.error("Error fetching data:", error);
        }
    };

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    /*const [appointmentsData, setAppointmentsData] = useState([
        {
            id: 1,
            day: 3,
            procedure: 'Процедура 1',
            start: '18:00',
            duration: '1 час',
            cost: '100',
        },
        {
            id: 2,
            day: 3,
            procedure: 'Процедура 3',
            start: '18:00',
            duration: '1 час',
            cost: '200',
        },
        {
            id: 3,
            day: 10,
            procedure: 'Процедура 2',
            start: '18:00',
            duration: '2 часа',
            cost: '150',
        },
        // ...другие записи
    ]);*/

    // Здесь нужно будет добавить логику запроса для получения данных о записях на сервере

    // Вместо Date.now() используйте библиотеку uuid для генерации уникальных id

// ...

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
                    executorServiceId: id,
                    starDate: startDate.toISOString(),
                    duration: endDate.toISOString(),
                    executorComment: "string",
                    price: parseFloat(newAppointmentData.cost), // convert cost to float
                };
                console.log(startDate);
                console.log(endDate);
                newAppointments.push(appointmentData);
            }
        }

        try {
            // Send a POST request to the backend endpoint
            const response = await axios.post('http://localhost:5155/order/add', newAppointments);

            // Handle the response, e.g., show a success message
            console.log('Data saved successfully', response.data);
        } catch (error) {
            // Handle errors, e.g., show an error message
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
            // Handle errors, e.g., show an error message
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
                // Handle errors, e.g., show an error message
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
                        <div key={index} className={`day ${selectedDays.includes(day) ? "selectedDay" : ""}`} onClick={() => handleDayClick(day)}>
                            {day}
                        </div>
                    ))}
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
            price: "",
        });
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
                            Название:{" "}
                            {
                                <input
                                    type="text"
                                    name="procedure"
                                    placeholder="Название"
                                    value={newAppointmentData.procedure}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, procedure: e.target.value })}
                                />
                            }
                        </div>
                        <div className="add-element">
                            Время начала:{" "}
                            {
                                <input
                                    type="time"
                                    name="starDate"
                                    placeholder="Время начала (HH:mm)"
                                    value={newAppointmentData.starDate}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, starDate: e.target.value })}
                                />
                            }
                        </div>
                        <div className="add-element">
                            Количество сеансов:{" "}
                            {
                                <input
                                    type="number"
                                    name="sessionCount"
                                    className="small-input" // Add this class
                                    placeholder="Количество сеансов"
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
                                    className="small-input" // Add this class
                                    placeholder="Время перерыва (минуты)"
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
                                    type="number"
                                    name="duration"
                                    className="small-input" // Add this class
                                    placeholder="Продолжительность (минуты)"
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
                                    name="price"
                                    placeholder="Стоимость"
                                    className="small-input" // Add this class
                                    value={newAppointmentData.price}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, price: e.target.value })}
                                />
                            }
                            {" "}б.р.
                        </div>
                    </div>
                    {
                        <button className="save" onClick={handleNewAppointmentSave}>Сохранить</button>
                    }
                </div>
            </div>
            );
        }
        return (
            <button className="newAppointmentButton" onClick={handleNewAppointmentClick}>
                Добавить
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
                                <div className="appointment">
                                    <div className="appointment-details">
                                        <div>
                                            Название:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    type="text"
                                                    name="procedure"
                                                    value={editedAppointments[appointment.id]?.serviceTypeName || ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{appointment.serviceTypeName}</strong>
                                            )}
                                        </div>
                                        <div>
                                            Время начала:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    type="text"
                                                    name="starDate"
                                                    value={editedAppointments[appointment.id]?.starDate || ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{formatTime(appointment.starDate)}</strong>
                                            )}
                                        </div>
                                        <div>
                                            Продолжительность:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    type="text"
                                                    name="duration"
                                                    value={editedAppointments[appointment.id]?.duration || ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{formatTime(appointment.duration)}</strong>
                                            )}
                                        </div>
                                        <div>
                                            Стоимость:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    type="text"
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
                                        <button className="save" onClick={handleSaveClick}>Сохранить</button>
                                    ) : (
                                        <div>
                                            <button className="edit" onClick={() => handleEditClick(appointment)}>Редактировать</button>
                                            <button className="delete" onClick={() => handleDeleteClick(appointment)}>Удалить</button>
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
            <div className="calendarContainer">
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