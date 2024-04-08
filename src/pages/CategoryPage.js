import React, {useContext, useEffect, useState} from "react";
import { ThemeContext } from "../components/ThemeContext";
import "../styles/Main.css";
import ServiceList from '../components/ServiceList';
import axios from "axios";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ImageWithButton from "../components/EmptyComponent";

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
                        photos: service.photos.length > 0 ? service.photos.map(photo => ({
                            id: photo.id,
                            url: photo.url,
                        })) : [{
                            id: 'default',
                            url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
                        }],
                    })),
                }));

                // Обновление состояния с новыми данными
                setServicesData(newServicesData);
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
            <div>
                {servicesData.length > 0 ? <ServiceList services={servicesData} /> : <ImageWithButton imageUrl="https://th.bing.com/th/id/OIG3.P9oT9D3EIP9NQhSwgVqH?w=1024&h=1024&rs=1&pid=ImgDetMain" text="К сожалению тут пусто"/> }
            </div>
        </div>
    );
};

export default HomePage;