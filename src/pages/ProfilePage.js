import React, {useContext, useEffect, useState} from 'react';
import '../styles/Profile.css';
import Profile from '../components/Profile';
import {useNavigate, useParams} from "react-router-dom";
import {ThemeContext} from "../components/ThemeContext";
import {getProfileById} from "../components/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Cookies from "js-cookie";

const ProfilePage = () => {

    let { id } = useParams();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [userData, setUserData] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [promotionsData, setPromotionsData] = useState([]);
    const [contactData, setContactData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('userId');
            const token = Cookies.get('token');
            if (!token) {
                navigate('/login');
            } else {
                const response = await getProfileById(id, navigate);
                if (response) {
                    setServicesData(response.services ? response.services.filter(service => !service.isDeleted) : []);
                    setPromotionsData(response.promotions ? response.promotions.filter(service => !service.isDeleted) : []);
                    setUserData(response.userData || {});
                    setContactData(response.contacts || []);
                    setIsEmpty(!response.userData);
                } else {
                    setIsEmpty(true);
                }
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
                <p>Нет сообщений</p>
            </div>
        );
    }

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Profile user = {userData} services = {servicesData} promotions={promotionsData} contacts={contactData} current = {!id}/>
        </div>
    );
};

export default ProfilePage;
