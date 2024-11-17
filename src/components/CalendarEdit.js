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
import {addOrder, deleteOrder, enrollCalendar, getExecutorServicesLookup, getOrdersByRole, updateOrder} from "./api";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {faClose} from "@fortawesome/free-solid-svg-icons/faClose";

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
        discountCost: "",
        executorComment: "",
    });
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [servicesLookupData, setServicesLookupData] = useState([]);
    const { theme } = useContext(ThemeContext);
    let { id } = useParams();
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const [isDeleteClick, setIsDeleteClick] = useState(false);
    const [isSaveClick, setIsSaveClick] = useState(false);
    const [isNewAppointmentSave, setIsNewAppointmentSave] = useState(false);


    useEffect(() => {
        fetchData();
    }, [currentMonth]);

    useEffect(() => {
        fetchLookupData();
    }, []);

    const fetchLookupData = async () => {
        const serverData = await getExecutorServicesLookup(navigate);
        setServicesLookupData(serverData);
    };

    const fetchData = async () => {
        getOrdersByRole(navigate, full, currentMonth, id)
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
        const timeFormat = /^\d{2}:\d{2}$/;
        if (timeFormat.test(rawTime)) {
            return rawTime;
        }

        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleNewAppointmentSave = async () => {
        setIsNewAppointmentSave(true);
        if (selectedDays.length === 0) {
            toast.error("Please select at least one day.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setIsNewAppointmentSave(false);
            return;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (const day of selectedDays) {
            const appointmentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            if (appointmentDate < today) {
                toast.error("Selected days must be today or in the future.", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setIsNewAppointmentSave(false);
                return;
            }
        }

        if (!newAppointmentData.cost || !newAppointmentData.duration || !newAppointmentData.procedure || !newAppointmentData.startTime || !newAppointmentData.breakTime || !newAppointmentData.sessionCount) {
            toast.error("All fields must be filled.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setIsNewAppointmentSave(false);
            return;
        }

        const newAppointments = [];
        for (const day of selectedDays) {
            const startTime = newAppointmentData.startTime;
            for (let i = 0; i < newAppointmentData.sessionCount; i++) {
                const newStartTime = addMinutes(startTime, i * (parseInt(newAppointmentData.duration) + parseInt(newAppointmentData.breakTime)));
                const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, ...newStartTime.split(':'));
                startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
                const durationInMinutes = parseInt(newAppointmentData.duration);
                const endDate = new Date(startDate.getTime() + durationInMinutes * 60000);

                const overlap = appointmentsData.some(appointment => {
                    const existingStart = new Date(appointment.starDate);
                    const existingEnd = new Date(appointment.duration);
                    return (startDate < existingEnd && endDate > existingStart);
                });

                if (overlap) {
                    toast.error("Appointment time overlaps with an existing appointment.", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    setIsNewAppointmentSave(false);
                    return;
                }

                const appointmentData = {
                    executorServiceId: newAppointmentData.procedure,
                    starDate: startDate.toISOString(),
                    duration: endDate.toISOString(),
                    executorComment: newAppointmentData.executorComment,
                    price: parseFloat(newAppointmentData.cost),
                    discountPrice: parseFloat(newAppointmentData.discountCost),
                };
                newAppointments.push(appointmentData);
            }
        }

        try {
            await addOrder(navigate, newAppointments);
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
        } finally {
            setIsNewAppointmentSave(false);
        }

        setAppointmentsData([...appointmentsData, ...newAppointments]);
        setIsNewAppointment(false);
        toast.success(translations[language]['Success'], {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'Success',
        });
        setIsNewAppointmentSave(false);
    };

    const handleEditClick = (appointment) => {
        setEditingAppointmentId(appointment.id);
        setEditedAppointments({ ...editedAppointments, [appointment.id]: { ...appointment } });
    };

    const handleDeleteClick = async (appointment) => {
        setIsDeleteClick(true);
        try {
            await deleteOrder(navigate, appointment.id);
            const updatedAppointmentsData = appointmentsData.filter((item) => item.id !== appointment.id);
            setAppointmentsData(updatedAppointmentsData);

            setEditingAppointmentId(null);
            setEditedAppointments({});
            toast.success(translations[language]['Success'], {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: 'Success',
            });
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
        } finally {
            setIsDeleteClick(false);
        }
    };

    const handleSaveClick = async () => {
        setIsSaveClick(true);
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
                if (!updatedAppointment.price || !updatedAppointment.duration || !updatedAppointment.starDate || !updatedAppointment.executorServiceId) {
                    toast.error("All fields must be filled.", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    return;
                }
                await updateOrder(navigate, updatedAppointment);
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
            } finally {
                setIsSaveClick(false);
            }

            setAppointmentsData(updatedAppointmentsData);
        }
        setEditingAppointmentId(null);
        setIsNewAppointment(false);
        toast.success(translations[language]['Success'], {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'Success',
        });
    };

    const handleCancelClick = async () => {
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
                    <button
                        className="monthButton"
                        onClick={() => {
                            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
                            setAppointmentsData([]); // Clear the appointments data
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
                            setAppointmentsData([]); // Clear the appointments data
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
                    {daysInMonth.map((day, index) => {
                        const hasAppointments = appointmentsData && appointmentsData.length > 0
                            ? appointmentsData.some(appointment => appointment.day === day) : false;
                        const hasAppointmentDiscounts = appointmentsData && appointmentsData.length > 0 ?
                            appointmentsData.some(appointment => appointment.day === day
                            && appointment.discountPrice !== null && appointment.discountPrice <= appointment.price) : false;
                        return (
                            <div
                                key={index}
                                className={`day ${theme === 'dark' ? 'dark' : ''} ${selectedDays.includes(day) ? "selectedDay" : `${hasAppointments ? "hasAppointments" : ""}`}`}
                                onClick={() => handleDayClick(day)}
                            >
                                {day}{hasAppointmentDiscounts ? <p4 className="discount-circle">%</p4> : ""}
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
            discountCost: "",
            executorComment: "",
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

    const LoadingAnimation = () => (
        <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
    );

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
                        <div className={`add-element ${theme === 'dark' ? 'dark' : ''}`}>
                            {translations[language]['StartTime']}:{" "}
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
                        <div className={`add-element ${theme === 'dark' ? 'dark' : ''}`}>
                            {translations[language]['NumberOfSessions']}:{" "}
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
                        <div className={`add-element ${theme === 'dark' ? 'dark' : ''}`}>
                            {translations[language]['BreakTime']}:{" "}
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
                        <div className={`add-element ${theme === 'dark' ? 'dark' : ''}`}>
                            {translations[language]['Duration']}:{" "}
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
                        <div className={`add-element ${theme === 'dark' ? 'dark' : ''}`}>
                            {translations[language]['Cost']}:{" "}
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
                            {" "} б.р.
                        </div>
                        <div className={`add-element ${theme === 'dark' ? 'dark' : ''}`}>
                            {translations[language]['DiscountCost']}:{" "}
                            {
                                <input
                                    type="number"
                                    name="discountCost"
                                    style={{width: "8ch"}}
                                    placeholder={translations[language]['DiscountCost']}
                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                    value={newAppointmentData.discountCost}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, discountCost: e.target.value })}
                                />
                            }
                            {" "} б.р.
                        </div>
                        <div className={`add-element ${theme === 'dark' ? 'dark' : ''}`}>
                            {translations[language]['ExecutorComment']}:{" "}
                            {
                                <input
                                    type="text"
                                    name="executorComment"
                                    style={{width: "18ch"}}
                                    placeholder={translations[language]['ExecutorComment']}
                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                    value={newAppointmentData.executorComment}
                                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, executorComment: e.target.value })}
                                />
                            }
                        </div>
                    </div>
                    {
                        <div className='edit-appointment-div'>
                            <button
                                className="save"
                                onClick={handleNewAppointmentSave}
                                disabled={isNewAppointmentSave}
                            >
                                {isNewAppointmentSave ? <LoadingAnimation /> : translations[language]['Save']}
                            </button>
                            <button className="delete" onClick={handleNewAppointmentCancel}>{translations[language]['Cancel']}</button>
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

    const enrollButtonClick = (id) => {
        enrollCalendar(id);
        toast.success(translations[language]['Success'], {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'Success',
        });
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
                                                    value={editedAppointments[appointment.id].executorServiceId}
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
                                                    type="time"
                                                    name="starDate"
                                                    placeholder={translations[language]['StartTime']}
                                                    style={{width: "auto"}}
                                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    value={editedAppointments[appointment.id] != null ? formatTime(editedAppointments[appointment.id].starDate) : ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{formatTime(appointment.starDate)}</strong>
                                            )}
                                        </div>
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>
                                            {translations[language]['EndTime']}:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    type="time"
                                                    placeholder={translations[language]['EndTime']}
                                                    style={{width: "auto"}}
                                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    name="duration"
                                                    value={editedAppointments[appointment.id] != null
                                                        ? formatTime(editedAppointments[appointment.id].duration)
                                                        : ""}
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
                                                    type="number"
                                                    style={{width: "8ch"}}
                                                    placeholder={translations[language]['Cost']}
                                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    name="price"
                                                    value={editedAppointments[appointment.id]?.price || ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{appointment.price ?? 0} byn</strong>
                                            )}
                                        </div>
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>
                                            {translations[language]['DiscountCost']}:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    type="number"
                                                    style={{width: "8ch"}}
                                                    placeholder={translations[language]['DiscountCost']}
                                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    name="discountPrice"
                                                    value={editedAppointments[appointment.id]?.discountPrice || ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{appointment.discountPrice ?? 0} byn</strong>
                                            )}
                                        </div>
                                        <div style={theme === 'dark' ? { color: "white"} : {}}>
                                            {translations[language]['ExecutorComment']}:{" "}
                                            {editingAppointmentId === appointment.id ? (
                                                <input
                                                    className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    name="executorComment"
                                                    value={editedAppointments[appointment.id]?.executorComment || ""}
                                                    onChange={(e) => handleInputChange(e, appointment.id)}
                                                />
                                            ) : (
                                                <strong>{appointment.executorComment === null || appointment.executorComment === "" ? '-' : appointment.executorComment}</strong>
                                            )}
                                        </div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ClientName']}: <strong>{appointment.clientName === null || appointment.clientName === "" ? '-' : appointment.clientName}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ClientComment']}: <strong>{appointment.clientComment === null || appointment.clientComment === "" ? '-' : appointment.clientComment}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ExecutorApprove']}: <strong>{appointment.executorApprove?
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
                                    {editingAppointmentId === appointment.id ? (
                                        <div className='edit-appointment-div'>
                                            <button
                                                className="save"
                                                onClick={handleSaveClick}
                                                disabled={isSaveClick}
                                            >
                                                {isSaveClick ? <LoadingAnimation /> : translations[language]['Save']}
                                            </button>
                                            <button className="delete" onClick={handleCancelClick}>{translations[language]['Cancel']}</button>
                                        </div>
                                    ) : (
                                        <div>
                                            {appointment.clientId == null &&
                                                <div className='edit-appointment-div'>
                                                    <button
                                                        className="edit"
                                                        onClick={() => handleEditClick(appointment)}
                                                    >
                                                        {translations[language]['Edit']}
                                                    </button>
                                                    <button
                                                        className="delete"
                                                        onClick={() => handleDeleteClick(appointment)}
                                                        disabled={isDeleteClick}
                                                    >
                                                        {isDeleteClick ? <LoadingAnimation /> : translations[language]['Delete']}
                                                    </button>
                                                </div>
                                            }
                                            {appointment.clientId != null && appointment.clientApprove
                                                && !appointment.executorApprove && new Date(appointment.starDate) > new Date() &&
                                                        <button style={{ backgroundColor: "transparent" }} onClick={() => enrollButtonClick(appointment.id)}>{translations[language]['MakeAnAppointment']}</button>

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