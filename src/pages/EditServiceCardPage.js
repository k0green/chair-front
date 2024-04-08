import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import '../styles/ServiceCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import EditServiceCard from "../components/EditServiceCard";
import Footer from "../components/Footer";
import {ThemeContext} from "../components/ThemeContext";
import {toast} from "react-toastify";

const EditServiceCardPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [service, setService] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === null

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5155/executor-service/get-by-id/${id}`);
                const formattedData = {
                    id: response.data.id,
                    name: response.data.executorName || 'Unknown Master',
                    serviceTypeId: response.data.serviceTypeId,
                    serviceTypeName: response.data.serviceTypeName,
                    executorId: response.data.executorId,
                    executorName: response.data.executorName,
                    description: response.data.description,
                    rating: response.data.rating,
                    price: response.data.price,
                    availableSlots: response.data.availableSlots,
                    duration: response.data.duration,
                    address: response.data.address,
                    //imageURLs: response.data.imageURLs.map((url, index) => ({ id: index + 1, url })),
                    photos: response.data.photos.length > 0 ? response.data.photos.map(photo => ({
                        id: photo.id,
                        url: photo.url,
                    })) : [{
                        id: 'default',
                        url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
                    }],
                };
                setService(formattedData);
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
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, navigate]);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            {service && <EditServiceCard service={service} isNew={isNew} id={id}/>}
        </div>
    );
};

export default EditServiceCardPage;
