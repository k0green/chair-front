import React, {useEffect, useState} from 'react';
import '../styles/Profile.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Profile from '../components/Profile';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const ProfilePage = () => {

    let { id } = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [contactData, setContactData] = useState([]);

    useEffect(() => {
        // Выполнение запроса при монтировании компонента
        const token = Cookies.get('token');
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`http://localhost:5155/executor-profile/get`)
                .then(response => {
                    // Преобразование данных с сервера в необходимый формат
                    const userData = {
                        id: response.data.id,
                        name: response.data.name,
                        imageUrl: response.data.imageUrl || 'https://wallpapercave.com/wp/wp9784502.jpg',
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
                                    photos: [{id: 1, url: 'path/to/photo1.jpg'}, {id: 2, url: 'path/to/photo2.jpg'}],
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
                    if (error.response) {
                        // Ошибка пришла с сервера (код ответа не 2xx)
                        if (error.response.status === 401) {
                            navigate("/login");
                        } else {
                            console.error(`Ошибка от сервера: ${error.response.status}`);
                        }
                    } else if (error.request) {
                        // Запрос был сделан, но ответ не был получен
                        console.error('Ответ не был получен. Возможно, проблемы с сетью.');
                    } else {
                        // Произошла ошибка при настройке запроса
                        console.error('Произошла ошибка при настройке запроса:', error.message);
                    }
                });
        }
    }, [id]);

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div>
            <Header/>
            <Profile user = {userData} services = {servicesData} contacts={contactData} current = {!id}/>
            <Footer/>
        </div>
    );
};

export default ProfilePage;
