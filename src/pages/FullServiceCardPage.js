import React, { useState, useEffect } from 'react';
import '../styles/ServiceCard.css';
import { useNavigate, useParams } from "react-router-dom";
import Reviews from "../components/Reviews";
import { toast } from 'react-toastify';
import ImageWithButton from "../components/EmptyComponent";
import {getExecutorServiceById, getReviewsByServiceCardId} from "../components/api";
import FullServiceCard from "../components/FullServiceCard";

const FullServiceCardPage = () => {
    const [service, setService] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getExecutorServiceById(id, navigate).then(newData => {
            setService(newData);
        });
    }, [id, navigate]);

    return (
        <div>
            {service ? <FullServiceCard service={service}/> : <ImageWithButton imageUrl="https://th.bing.com/th/id/OIG4.GeHTSGRF8YmGdNyeUNsk?w=1024&h=1024&rs=1&pid=ImgDetMain" text="Что-то пошло не так"/> }
        </div>
    );
};

export default FullServiceCardPage;