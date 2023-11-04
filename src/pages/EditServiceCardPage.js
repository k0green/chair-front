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
                    imageURLs: [{ id: 1, url: 'path/to/photo1.jpg' }, { id: 2, url: 'path/to/photo2.jpg' }],
                };
                setService(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, navigate]);

    return (
        <div>
            <Header />
            {service && <EditServiceCard service={service} isNew={isNew} id={id}/>}
            <Footer />
        </div>
    );
};

export default EditServiceCardPage;
