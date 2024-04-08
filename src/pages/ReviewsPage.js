import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ServiceCard.css';
import { useNavigate, useParams } from "react-router-dom";
import Reviews from "../components/Reviews";
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import ImageWithButton from "../components/EmptyComponent";

const ReviewsPage = () => {
    const [service, setService] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === null

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if(!token)
            navigate("/login");
        else {
            console.log(id);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
                        duration: formatTime(response.data.duration),
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
                    console.error('Error fetching data:', error);
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
                }
            };

            fetchData();
        }
    }, [id, navigate]);

    return (
        <div>
            {service ? <Reviews service={service}/> : <ImageWithButton imageUrl="https://th.bing.com/th/id/OIG4.GeHTSGRF8YmGdNyeUNsk?w=1024&h=1024&rs=1&pid=ImgDetMain" text="Что-то пошло не так"/> }
        </div>
    );
};

export default ReviewsPage;