import React, { useContext, useEffect, useState } from 'react';
import '../styles/Calendar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft, faChevronCircleRight, faCheck, faClose, faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { ThemeContext } from "./ThemeContext";
import { LanguageContext } from "./LanguageContext";
import {cancelCalendar, enrollCalendar, getOrdersByRole, updateOrder} from "./api";
import {toast} from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";

const Calendar = ({ full }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [appointmentsData, setAppointmentsData] = useState([]);
    const { theme, toggleTheme } = useContext(ThemeContext);
    let { id } = useParams();
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const [clientComment, setClientComment] = useState();
    const [isEnrollLoading, setIsEnrollLoading] = useState(false);
    const [isCancelLoading, setIsCancelLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) {
                navigate('/login');
            } else {
                const response = await getOrdersByRole(navigate, full, currentMonth, id);
                setAppointmentsData(response);
                if (response) {
                    setAppointmentsData(response);
                    setIsEmpty(!response);
                } else {
                    setAppointmentsData(null);
                    setIsEmpty(true);
                }
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentMonth, navigate, full, id]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isEmpty) {
        return (
            <div className={`empty-state ${theme === 'dark' ? 'dark' : ''}`}>
                <p>Данные не найдены</p> // Сообщение о пустом списке
            </div>
        );
    }

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
        setIsEnrollLoading(true);
        try {
            await enrollCalendar(navigate, appointment.id);
            if (clientComment)
                await updateOrder(navigate, clientComment);
            const serverData = await getOrdersByRole(navigate, full, currentMonth, id);
            setAppointmentsData(serverData);
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
            console.error(error);
            toast.error(translations[language]['Error'], {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: 'Error',
            });
        } finally {
            setIsEnrollLoading(false);
        }
    };

    const cancelButtonClick = async (appointment) => {
        setIsCancelLoading(true);
        try {
            await cancelCalendar(navigate, appointment.id);
            const serverData = await getOrdersByRole(navigate, full, currentMonth, id);
            setAppointmentsData(serverData);
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
            console.error(error);
            toast.error(translations[language]['Error'], {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: 'Error',
            });
        } finally {
            setIsCancelLoading(false);
        }
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
                    <button
                        className="monthButton"
                        onClick={() => {
                            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
                            setAppointmentsData([]);
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
                            setAppointmentsData([]);
                        }}>
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
                        const hasAppointmentDiscounts = appointmentsData.some(appointment => appointment.day === day
                            && appointment.discountPrice !== null && appointment.discountPrice <= appointment.price);
                        return (
                            <div
                                key={index}
                                className={`day ${theme === 'dark' ? 'dark' : ''} ${selectedDay === day ? "selectedDay" : `${hasAppointments ? "hasAppointments" : ""}`}`}
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

    const saveClientComment = async () => {
        if(clientComment)
            await updateOrder(navigate, clientComment);
        toast.success(translations[language]['Success'], {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'Success',
        });
    }

    const renderAppointments = () => {
        if (selectedDay !== null) {
            const appointments = appointmentsData.filter(appointment => appointment.day === selectedDay);
            if (appointments.length > 0) {
                const userRole = localStorage.getItem('userRole');
                const userId = localStorage.getItem('userId');
                return (
                    <div className="cards-container">
                        {appointments.map((appointment, index) => (
                            <div key={index} className="appointmentContainer">
                                <div className={`appointment ${theme === 'dark' ? 'dark' : ''}`}>
                                    <div className="appointment-details">
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['Name']}: <strong>{appointment.serviceTypeName}</strong> </div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['StartTime']}: <strong>{formatTime(appointment.starDate)}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['EndTime']}: <strong>{formatTime(appointment.duration)}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['Cost']}: <strong>{appointment.price ?? 0} byn</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['DiscountCost']}: <strong>{appointment.discountPrice ?? 0} byn</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ExecutorComment']}: <strong>{appointment.executorComment}</strong></div>
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ClientName']}: <strong>{appointment.clientName}</strong></div>
                                        {userRole === 'executor' ?
                                            <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ClientComment']}: <strong>{appointment.clientComment}</strong></div>
                                            :
                                            <div style={theme === 'dark' ? { color: "white" } : {}}>
                                                {translations[language]['ClientComment']}:{" "}
                                                <textarea
                                                    style={{width: "99%", borderRadius: "5px", height: "16ch", borderColor: "#c5c5c5", ...(theme === 'dark' ? { backgroundColor: "#695b5b", color: "#fff" } : { backgroundColor: "#ffffff", color: "fff" })}}
                                                    placeholder={translations[language]['ClientComment']}
                                                    className={`description-textarea ${theme === 'dark' ? 'dark' : ''}`}
                                                    type="text"
                                                    name="clientComment"
                                                    value={clientComment?.clientComment ?? appointment.clientComment}
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
                                    {new Date(appointment.starDate) > new Date() && !full && (
                                        <button
                                            style={{ backgroundColor: "transparent" }}
                                            onClick={() => enrollButtonClick(appointment)}
                                            disabled={isEnrollLoading}
                                        >
                                            {isEnrollLoading ? <LoadingAnimation /> : translations[language]['MakeAnAppointment']}
                                        </button>
                                    )}

                                    {new Date(appointment.starDate) > new Date() && appointment.clientId !== null && appointment.clientId === userId && (
                                        <button
                                            style={{ backgroundColor: "transparent" }}
                                            onClick={() => cancelButtonClick(appointment)}
                                            disabled={isCancelLoading}
                                        >
                                            {isCancelLoading ? <LoadingAnimation /> : translations[language]['CancelAppointment']}
                                        </button>
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

    const LoadingAnimation = () => (
        <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
    );

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
