import React from 'react';
import '../styles/Profile.css'; // Файл стилей для страницы профиля
import ServiceCard from '../components/ServiceCard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import EditServiceCard from "./EditServiceCard";
import {useNavigate} from "react-router-dom";

const Profile = ({user, services}) => {
    const navigate = useNavigate();
    //console.log(user.name);
    console.log(user.bio);
    if (!user || !user.services) {
        return <div>Loading...</div>; // You can customize the loading state as needed
    }

    const handleNewServiceClick = () => {
            navigate("/service-card/add");
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar">
                    <img src={user.avatar} alt="User Avatar" className="avatar-image"/>
                </div>
                <div className="profile-bio">
                    <h1>{user.name}</h1>
                    <p>{user.bio}</p>
                    <button className="message-button">
                        <FontAwesomeIcon icon={faComment}/> Написать сообщение
                    </button>
                    <button className="newAppointmentButton" onClick={handleNewServiceClick}>
                        Добавить
                    </button>
                </div>
            </div>
            <div className="services-list">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} isProfile = {true}/>
                ))}
            </div>
        </div>
    );
}

export default Profile;
