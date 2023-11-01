import React from 'react';
import '../styles/ServiceCard.css';
import {
    faBoltLightning,
    faClock,
    faHouse,
    faLightbulb,
    faStar,
    faTimes,
    faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; // Подключаем файл стилей
import PhotoList from "../components/PhotoList";
import {useNavigate} from "react-router-dom";

const ServiceCard = ({ service, isProfile }) => {
    const navigate = useNavigate();
    const { id, name, masters } = service;

    const handleOrderClick = (executorServiceId) => {
        navigate("/calendar/"+ executorServiceId);
    };

    let handleMasterNameClickClick = (masterId) => {
        navigate("/profile/" + masterId);
    };

    const handleIsProfileClick = (executorServiceId) => {
        navigate("/service-card/edit/" + executorServiceId);
    };

    return (
        <div className="service-card">
            {masters.map((master) => (
                <div key={master.id} className="master-card">
                    <div className="photos">
                        {/*{master.photos.map((photo, index) => (
                            <img
                                key={photo.id}
                                src={photo.url}
                                alt={`Photo ${photo.id}`}
                                className={index === 0 ? "active" : ""}
                            />
                        ))}
                        {master.photos.length > 1 && (
                            <div className="arrow-buttons">
                                <button>&larr;</button>
                                <button>&rarr;</button>
                            </div>
                        )}*/}
                        <PhotoList photos={master.photos}/>
                    </div>
                    <div className="master-info">
                        <h4 onClick={() => handleMasterNameClickClick(master.executorId)}>{master.name}</h4>
                        <h4>{master.rating} <FontAwesomeIcon icon={faStar} className = 'item-icon'/></h4>
                    </div>
                    <div className="service-description">
                        <p>{master.description}</p>
                        <p><FontAwesomeIcon icon={faHouse} className = 'item-icon'/>{master.address}</p>
                        <p>Available Slots: {master.availableSlots}</p>
                    </div>
                    <div className="master-info">
                        <h4><FontAwesomeIcon icon={faClock} className = 'item-icon'/> {master.duration}</h4>
                        <h4>{master.price} Byn</h4>
                    </div>
                    <div>
                        {isProfile ?
                            <button className="order-button" onClick={()=>handleIsProfileClick(service.id)}>
                                <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} />    Редактировать</p>
                            </button>
                            :
                            <button className="order-button" onClick={()=>handleOrderClick(master.id)}>
                                <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} />    Записаться</p>
                            </button>
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceCard;






