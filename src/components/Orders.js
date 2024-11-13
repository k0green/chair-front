import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import {approveOrder, getOrders, LoadingAnimation, registerQuery, updateOrder} from "./api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {faClose} from "@fortawesome/free-solid-svg-icons/faClose";
import app from "../App";
import {faSave} from "@fortawesome/free-solid-svg-icons/faSave";
import LoadingSpinner from "./LoadingSpinner";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faEye} from "@fortawesome/free-solid-svg-icons/faEye";

const AppointmentsComponent = () => {
    const [appointmentsData, setAppointmentsData] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const navigate = useNavigate();
    const isExecutor = localStorage.getItem("userRole") === "executor";
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);
    const [clientComment, setClientComment] = useState();
    const [isApproveClick, setIsApproveClick] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [selectedTab, setSelectedTab] = useState(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
        }
        fetchData();
    }, [currentMonth]);

    const fetchData = async () => {
        const response = await getOrders(navigate);
        if (response) {
            setAppointmentsData(response);
            setIsEmpty(!response);
        } else {
            setAppointmentsData(response);
            setIsEmpty(true);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isEmpty) {
        return (
            <div className={`empty-state ${theme === 'dark' ? 'dark' : ''}`}>
                <p>Данные не найдены</p>
            </div>
        );
    }

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleApproveClick = (id) => {
        setIsApproveClick(true);
        try{
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
            toast.success(translations[language]['Success'], {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: 'Success',
            });
        }catch (e){
            console.log(e)
        }finally {
            setIsApproveClick(false);
        }
    };

    const saveClientComment = async () => {
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

    const renderAppointments = (filteredAppointments) => {
        if (filteredAppointments !== null && filteredAppointments.length > 0) {
            const userRole = localStorage.getItem('userRole');
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
                                    <div style={theme === 'dark' ? { color: "white"} : { color: "black" }}>{translations[language]['DiscountCost']}: <strong>{appointment.discountPrice} byn</strong></div>
                                    <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ExecutorComment']}: <strong>{appointment.executorComment}</strong></div>
                                    <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ClientName']}: <strong>{appointment.clientName}</strong></div>
                                    {userRole === 'executor' ?
                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ClientComment']}: <strong>{appointment.clientComment}</strong></div>
                                        :
                                        <div >
                                            {translations[language]['ExecutorComment']}:{" "}
                                            {
                                                <input
                                                    type="text"
                                                    name="clientComment"
                                                    style={{width: "18ch"}}
                                                    placeholder={translations[language]['ClientComment']}
                                                    className={`newAppointmentForm1-input ${theme === 'dark' ? 'dark' : ''}`}
                                                    value={appointment.clientComment}
                                                    onChange={(e) => setClientComment({ ...appointment, clientComment: e.target.value })}
                                                />
                                            }
                                                <button onClick={() => saveClientComment()}>
                                                    <FontAwesomeIcon
                                                        icon={faSave}
                                                        style={{ color: "lightgreen", backgroundColor: "transparent" }}
                                                    />
                                                </button>
                                        </div>
                                    }                                        <div style={theme === 'dark' ? { color: "white" } : {}}>{translations[language]['ExecutorApprove']}: <strong>{appointment.executorApprove?
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
                                {appointment.clientId && (
                                    isExecutor ? (
                                        !appointment.executorApprove && (
                                            <button
                                                onClick={() => handleApproveClick(appointment.id)}
                                                disabled={!appointment.clientId}>
                                                {translations[language]['ApproveOrder']}
                                            </button>
                                        )
                                    ) : (
                                        !appointment.clientApprove && appointment.executorApprove && (
                                            <button
                                                onClick={() => handleApproveClick(appointment.id)}
                                                disabled={!appointment.clientId && isApproveClick}
                                            >
                                                {isApproveClick ? <LoadingAnimation /> : translations[language]['ApproveOrder']}
                                            </button>
                                        )
                                    )
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p>{translations[language]['NoAppointmentsAvailableForTheSelectedDateRange']}</p>;
        }
    };

    const openModal = (tabName) => {
        setSelectedTab(tabName);
        setUploadPhotoModal(true);
    };

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`} onClick={() => openModal('byClient')}>
                {translations[language]['ByMaster']}
                <FontAwesomeIcon icon={faEye} style={{ marginRight: '10px', scale: "0.8", cursor: 'pointer', ...(theme === 'dark' ? { color: 'white' } : { color: '#000' }) }} />
            </div>

            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`} onClick={() => openModal('byMaster')}>
                {translations[language]['ByClient']}
                    <FontAwesomeIcon icon={faEye} style={{ marginRight: '10px', scale: "0.8", cursor: 'pointer', ...(theme === 'dark' ? { color: 'white' } : { color: '#000' }) }} />
            </div>

            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`} onClick={() => openModal('forToday')}>
                {translations[language]['OrdersForADay']}
                    <FontAwesomeIcon icon={faEye} style={{ marginRight: '10px', scale: "0.8", cursor: 'pointer', ...(theme === 'dark' ? { color: 'white' } : { color: '#000' }) }} />
            </div>
            <div className={`tab ${theme === 'dark' ? 'dark' : ''}`} onClick={() => openModal('forWeek')}>
                {translations[language]['OrdersForAWeek']}
                    <FontAwesomeIcon icon={faEye} style={{ marginRight: '10px', scale: "0.8", cursor: 'pointer', ...(theme === 'dark' ? { color: 'white' } : { color: '#000' }) }} />
            </div>
            <div className={`filter-overlay ${uploadPhotoModal ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="filter-content">
                    <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                        <FontAwesomeIcon icon={faXmark} onClick={() => setUploadPhotoModal(false)} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" }) }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                        {selectedTab === 'byClient' && appointmentsData && renderAppointments(appointmentsData.byClient)}
                        {selectedTab === 'byMaster' && appointmentsData && renderAppointments(appointmentsData.byMaster)}
                        {selectedTab === 'forToday' && appointmentsData && renderAppointments(appointmentsData.forToday)}
                        {selectedTab === 'forWeek' && appointmentsData && renderAppointments(appointmentsData.forWeek)}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AppointmentsComponent;
