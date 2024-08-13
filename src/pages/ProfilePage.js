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
    const [contactData, setContactData] = useState([]);

    useEffect(() => {
        getProfileById(id, navigate).then(newData => {
            setServicesData(newData.services.filter(service => service.isDeleted !== true));
            setUserData(newData.userData);
            setContactData(newData.contacts);
        });
    }, [id]);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Profile user = {userData} services = {servicesData} contacts={contactData} current = {!id}/>
        </div>
    );
};

export default ProfilePage;
