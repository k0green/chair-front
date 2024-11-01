import React, {useContext, useEffect, useState} from 'react';
import '../styles/Profile.css';
import Profile from '../components/Profile';
import {useNavigate, useParams} from "react-router-dom";
import {ThemeContext} from "../components/ThemeContext";
import {toast} from "react-toastify";
import {getProfileById} from "../components/api";

const ProfilePage = () => {

    let { id } = useParams();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [userData, setUserData] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [promotionsData, setPromotionsData] = useState([]);
    const [contactData, setContactData] = useState([]);

    useEffect(() => {
        getProfileById(id, navigate).then(newData => {
            if (newData.services && newData.services.length > 0) {
                setServicesData(newData.services.filter(service => service.isDeleted !== true));
            } else {
                setServicesData([]);
            }

            if (newData.promotions && newData.promotions.length > 0) {
                setPromotionsData(newData.promotions.filter(service => service.isDeleted !== true));
            } else {
                setPromotionsData([]);
            }
            console.log(newData);
            console.log(newData.promotions);
            setUserData(newData.userData);
            setContactData(newData.contacts);
        });

    }, [id]);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Profile user = {userData} services = {servicesData} promotions={promotionsData} contacts={contactData} current = {!id}/>
        </div>
    );
};

export default ProfilePage;
