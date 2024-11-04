import React, { useState, useEffect, useContext } from 'react';
import '../styles/ServiceCard.css';
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../components/ThemeContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { getExecutorPromotionById } from "../components/api";
import EditPromotionCard from "../components/EditPromotionCard";

const EditPromotionCardPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === null;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getExecutorPromotionById(id, navigate);
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
                <p>Данные не найдены</p> // Сообщение о пустом списке
            </div>
        );
    }

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            {service && <EditPromotionCard service={service} isNew={false} id={id}/>}
        </div>
    );
};

export default EditPromotionCardPage;