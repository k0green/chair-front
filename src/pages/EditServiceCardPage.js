import React, {useState, useEffect, useContext} from 'react';
import '../styles/ServiceCard.css';
import { useNavigate, useParams } from "react-router-dom";
import EditServiceCard from "../components/EditServiceCard";
import {ThemeContext} from "../components/ThemeContext";
import {toast} from "react-toastify";
import {getExecutorServiceById, getOptimalServiceCard} from "../components/api";

const EditServiceCardPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [service, setService] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === null

    useEffect(() => {
        getExecutorServiceById(id, navigate).then(newData => {
            setService(newData);
        })
    }, [id, navigate]);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            {service && <EditServiceCard service={service} isNew={isNew} id={id}/>}
        </div>
    );
};

export default EditServiceCardPage;
