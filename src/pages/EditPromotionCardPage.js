import React, {useState, useEffect, useContext} from 'react';
import '../styles/ServiceCard.css';
import { useNavigate, useParams } from "react-router-dom";
import EditServiceCard from "../components/EditServiceCard";
import {ThemeContext} from "../components/ThemeContext";
import {toast} from "react-toastify";
import {getExecutorPromotionById, getExecutorServiceById, getOptimalServiceCard} from "../components/api";
import EditPromotionCard from "../components/EditPromotionCard";

const EditPromotionCardPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [service, setService] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === null

    useEffect(() => {
        getExecutorPromotionById(id, navigate).then(newData => {
            setService(newData);
        })
    }, [id, navigate]);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            {service && <EditPromotionCard service={service} isNew={false} id={id}/>}
        </div>
    );
};

export default EditPromotionCardPage;
