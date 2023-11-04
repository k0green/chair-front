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
    let { id } = useParams();

    const service =
        {
            id: 1,
            name: 'Service 1',
            //availableSlots: 3,
            duration: '0001-01-01T01:00:00',
            serviceTypeId: "36dc8d14-c955-4d33-9b2b-cf2ea432da3c",
            imageURLs: [{ id: 1, url: 'path/to/photo1.jpg' }, { id: 2, url: 'path/to/photo2.jpg' }],
        };

    return (
        <div>
            <Header />
            <EditServiceCard service={service} isNew={true} id={id}/>
            <Footer />
        </div>
    );
};

export default AddServiceCardPage;
