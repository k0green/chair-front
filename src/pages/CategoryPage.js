import React, {useContext, useEffect, useState} from "react";
import { ThemeContext } from "../components/ThemeContext";
import "../styles/Main.css";
import {useParams} from "react-router-dom";
import ServiceCardTypeList from "./ErrorPage";
import {getServiceTypeById} from '../components/api';
import {toast} from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = ({ user, onLogout }) => {
    const { theme } = useContext(ThemeContext);
    let { id } = useParams();
    const [typeData, setTypeData] = useState(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newData = await getServiceTypeById(id);
                if (newData) {
                    setTypeData(newData);
                    setIsEmpty(!newData);
                } else {
                    setTypeData(null);
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
                setTypeData(null);
                setIsEmpty(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
            <div>
                <ServiceCardTypeList id={id} name={typeData.name} parentTypeId = {typeData.parentId} filter={{ skip: 0, take: 2 }} />
            </div>
        </div>
    );
};

export default HomePage;
