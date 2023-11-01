import React, {useEffect, useState} from 'react';
import '../styles/Profile.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Profile from '../components/Profile';
import {useParams} from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {

    let { id } = useParams();
    console.log(id);

    const [userData, setUserData] = useState([]);
    const [servicesData, setServicesData] = useState([]);

    useEffect(() => {
        // Выполнение запроса при монтировании компонента
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.get(`http://localhost:5155/executor-profile/get-by-id/`+id)
            .then(response => {
                // Преобразование данных с сервера в необходимый формат
                const userData = {
                    id: response.data.id,
                    name: response.data.name,
                    avatar: response.data.imageUrl || 'https://wallpapercave.com/wp/wp9784502.jpg',
                    bio: response.data.description,
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
                                photos: [{ id: 1, url: 'path/to/photo1.jpg' }, { id: 2, url: 'path/to/photo2.jpg' }],
                            },
                        ],
                    })),
                };

                // Обновление состояния с новыми данными
                setServicesData(userData.services);
                setUserData(userData);
            })
            .catch(error => {
                // Handle error
                console.error('Error fetching data:', error);
            });
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
            <Profile user = {userData} services = {servicesData}/>
            <Footer/>
        </div>
    );
};

export default ProfilePage;
