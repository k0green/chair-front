import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ServiceCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import EditServiceCard from "../components/EditServiceCard";
import Footer from "../components/Footer";

const AddServiceCardPage = () => {
    //const [service, setService] = useState(null);
    const navigate = useNavigate();

    const service =
        {
            id: 1,
            name: 'Service 1',
            masters: [
                {
                    //id: 1,
                    name: 'Name',
                    description: 'Description',
                    price: 50,
                    //availableSlots: 3,
                    duration: '01:00',
                    //rating: 4.5,
                    photos: [{ id: 1, url: 'path/to/photo1.jpg' }],
                },
                // Добавьте других мастеров, если нужно
            ],
        };

    return (
        <div>
            <Header />
            <EditServiceCard service={service} isNew={true} />
            <Footer />
        </div>
    );
};

export default AddServiceCardPage;
