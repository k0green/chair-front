import React, {useContext, useEffect, useState} from 'react';
import '../styles/Profile.css';
import Profile from '../components/Profile';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import {ThemeContext} from "../components/ThemeContext";
import {toast} from "react-toastify";

const ProfilePage = () => {

    let { id } = useParams();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [userData, setUserData] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [contactData, setContactData] = useState([]);

    useEffect(() => {
        const token = Cookies.get('token');
        if(!token)
            navigate("/login");
        else {
            console.log(id);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            if(!id)
            {
                axios.get(`http://localhost:5155/executor-profile/get`)
                    .then(response => {
                        // Преобразование данных с сервера в необходимый формат
                        const userData = {
                            id: response.data.id,
                            name: response.data.name,
                            imageUrl: response.data.imageUrl,
                            description: response.data.description,
                            userId: response.data.userId,
                            contacts: response.data.contacts.map(contact => ({
                                id: contact.id,
                                name: contact.name,
                                type: contact.type,
                                executorProfileId: contact.executorProfileId,
                            })),
                            services: response.data.services.map(service => ({
                                id: service.id,
                                name: service.serviceTypeName || 'Unknown Service',
                                masters: [
                                    {
                                        id: service.executorId,
                                        name: service.executorName || 'Unknown Master',
                                        description: service.description,
                                        price: service.price,
                                        availableSlots: service.availableSlots,
                                        duration: formatTime(service.duration),
                                        rating: service.rating,
                                        address: service.address,
                                        //photos: service.imageURLs.map((url, index) => ({ id: index + 1, url })),
                                        photos: service.photos.length > 0 ? service.photos.map(photo => ({
                                            id: photo.id,
                                            url: photo.url,
                                        })) : [{
                                            id: 'default',
                                            url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
                                        }],
                                    },
                                ],
                            })),
                        };

                        // Обновление состояния с новыми данными
                        setServicesData(userData.services);
                        setUserData(userData);
                        setContactData(userData.contacts);
                    })
                    .catch(error => {
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
                        if (error.response) {
                            if (error.response.status === 401) {
                                navigate("/login");
                            } else {
                                console.error(`Ошибка от сервера: ${error.response.status}`);
                            }
                        } else if (error.request) {
                            console.error('Ответ не был получен. Возможно, проблемы с сетью.');
                        } else {
                            console.error('Произошла ошибка при настройке запроса:', error.message);
                        }
                    });
            }
            else {
                axios.get(`http://localhost:5155/executor-profile/get-by-id/`+id)
                    .then(response => {
                        const userData = {
                            id: response.data.id,
                            name: response.data.name,
                            imageUrl: response.data.imageUrl,
                            description: response.data.description,
                            userId: response.data.userId,
                            contacts: response.data.contacts.map(contact => ({
                                id: contact.id,
                                name: contact.name,
                                type: contact.type,
                                executorProfileId: contact.executorProfileId,
                            })),
                            services: response.data.services.map(service => ({
                                id: service.id,
                                name: service.serviceTypeName || 'Unknown Service',
                                masters: [
                                    {
                                        id: service.id,
                                        name: service.executorName || 'Unknown Master',
                                        description: service.description,
                                        price: service.price,
                                        availableSlots: service.availableSlots,
                                        duration: formatTime(service.duration),
                                        rating: service.rating,
                                        address: service.address,
                                        executorId: service.executorId,
                                        //photos: service.imageURLs.map((url, index) => ({ id: index + 1, url })),
                                        /*photos: service.photos.length > 0 ? service.photos.map(photo => ({
                                            id: photo.id,
                                            url: photo.url,
                                        })) : [{
                                            id: 'default',
                                            url: 'https://th.bing.com/th/id/OIG2.01QU5flA2Zrk9DFkj8wU?w=1024&h=1024&rs=1&pid=ImgDetMain', // Здесь добавлен запасной URL
                                        }],*/
                                    },
                                ],
                            })),
                        };

                        // Обновление состояния с новыми данными
                        setServicesData(userData.services);
                        setUserData(userData);
                        setContactData(userData.contacts);
                    })
                    .catch(error => {
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
                        if (error.response) {
                            if (error.response.status === 401) {
                                navigate("/login");
                            } else {
                                console.error(`Ошибка от сервера: ${error.response.status}`);
                            }
                        } else if (error.request) {
                            console.error('Ответ не был получен. Возможно, проблемы с сетью.');
                        } else {
                            console.error('Произошла ошибка при настройке запроса:', error.message);
                        }
                    });
            }
        }
    }, [id]);

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Profile user = {userData} services = {servicesData} contacts={contactData} current = {!id}/>
        </div>
    );
};

export default ProfilePage;
