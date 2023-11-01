import React, {useContext, useEffect, useState} from "react";
import { ThemeContext } from "../context/ThemeContext";
import Footer from '../components/Footer';
import Header from '../components/Header';
import "../styles/Main.css";
import Icon from '../components/Categories';
import ServiceList from '../components/ServiceList';
import ph1 from '../testPhotos/ph1.png';
import ph2 from '../testPhotos/ph2.png';
import axios from "axios";
import { parseISO, format } from 'date-fns';
import {useParams} from "react-router-dom";

const HomePage = ({ user, onLogout }) => {
    const { theme } = useContext(ThemeContext);
    //const { theme } = true;
    let { id } = useParams();

    const [servicesData, setServicesData] = useState([]);

    useEffect(() => {
        // Выполнение запроса при монтировании компонента
        axios.get(`http://localhost:5155/executor-service/type/`+id)
            .then(response => {
                // Преобразование данных с сервера в необходимый формат
                const newServicesData = response.data.map(serviceType => ({
                    id: serviceType.id,
                    name: serviceType.serviceTypeName,
                    masters: serviceType.services.map(service => ({
                        id: service.id,
                        name: service.executorName,
                        description: service.description,
                        price: service.price,
                        availableSlots: service.availableSlots,
                        duration: formatTime(service.duration),
                        rating: service.rating,
                        address: service.address,
                        executorId: service.executorId,
                        //photos: service.imageURLs.map((url, index) => ({ id: index + 1, url })),
                        photos: [{ id: 1, url: 'path/to/photo1.jpg' }, { id: 2, url: 'path/to/photo2.jpg' }],
                    })),
                }));

                // Обновление состояния с новыми данными
                setServicesData(newServicesData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }, []);

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Header user={user} onLogout={onLogout} />
            <div>
                <ServiceList services={servicesData} />
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;