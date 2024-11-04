import React, {useState, useEffect, useContext} from 'react';
import '../styles/ServiceCard.css';
import { useNavigate, useParams } from "react-router-dom";
import EditServiceCard from "../components/EditServiceCard";
import {ThemeContext} from "../components/ThemeContext";
import {getExecutorServiceById} from "../components/api";
import LoadingSpinner from "../components/LoadingSpinner";

const EditServiceCardPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === null;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getExecutorServiceById(id, navigate);
            if (response) {
                setService(response);
                setIsEmpty(!response);
            } else {
                setService(null);
                setIsEmpty(true);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [id, navigate]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isEmpty) {
        return (
            <div className={`empty-state ${theme === 'dark' ? 'dark' : ''}`}>
                <p>Данные не найдены</p>
            </div>
        );
    }

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            {service && <EditServiceCard service={service} isNew={isNew} id={id}/>}
        </div>
    );
};

export default EditServiceCardPage;