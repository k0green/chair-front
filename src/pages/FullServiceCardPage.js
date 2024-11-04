import React, {useState, useEffect, useContext} from 'react';
import '../styles/ServiceCard.css';
import { useNavigate, useParams } from "react-router-dom";
import Reviews from "../components/Reviews";
import { toast } from 'react-toastify';
import ImageWithButton from "../components/EmptyComponent";
import {getExecutorServiceById, getReviewsByServiceCardId} from "../components/api";
import FullServiceCard from "../components/FullServiceCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {ThemeContext} from "../components/ThemeContext";

const FullServiceCardPage = () => {
    const [service, setService] = useState(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newData = await getExecutorServiceById(id, navigate);
                if (newData) {
                    setService(newData);
                    setIsEmpty(!newData);
                } else {
                    setService(null);
                    setIsEmpty(true);
                }
            } catch (error) {
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
                setService(null);
                setIsEmpty(true);
            } finally {
                setIsLoading(false);
            }
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
        <div>
            {<FullServiceCard service={service}/>}
        </div>
    );
};

export default FullServiceCardPage;