import React, { useState, useEffect } from 'react';
import '../styles/ServiceCard.css';
import { useNavigate, useParams } from "react-router-dom";
import Reviews from "../components/Reviews";
import { toast } from 'react-toastify';
import ImageWithButton from "../components/EmptyComponent";
import {getExecutorServiceById} from "../components/api";

const ReviewsPage = () => {
    const [service, setService] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getExecutorServiceById(id, navigate).then(newData => {
            setService(newData);
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
    }, [id, navigate]);

    return (
        <div>
            {service ? <Reviews service={service}/> : <ImageWithButton imageUrl="https://th.bing.com/th/id/OIG4.GeHTSGRF8YmGdNyeUNsk?w=1024&h=1024&rs=1&pid=ImgDetMain" text="Что-то пошло не так"/> }
        </div>
    );
};

export default ReviewsPage;