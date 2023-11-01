import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ServiceCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import EditServiceCard from "../components/EditServiceCard";
import Footer from "../components/Footer";

const EditServiceCardPage = () => {
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
                    masters: [
                        {
                            id: response.data.executorId,
                            name: response.data.executorName || 'Unknown Master',
                            description: response.data.description,
                            price: response.data.price,
                            availableSlots: response.data.availableSlots,
                            duration: formatTime(response.data.duration),
                            rating: response.data.rating,
                            //photos: response.data.imageURLs.map((url, index) => ({ id: index + 1, url })),
                            photos: [{ id: 1, url: 'path/to/photo1.jpg' }, { id: 2, url: 'path/to/photo2.jpg' }],
                        },
                    ],
                };
                setService(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, navigate]);

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div>
            <Header />
            {service && <EditServiceCard service={service} isNew={isNew} />}
            <Footer />
        </div>
    );
};

export default EditServiceCardPage;
