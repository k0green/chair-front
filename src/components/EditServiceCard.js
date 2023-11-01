import React, { useState } from 'react';
import '../styles/ServiceCard.css';
import { faBoltLightning, faClock, faLightbulb, faStar, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ServiceCard = ({ service, isNew }) => {
    const navigate = useNavigate();
    const { masters } = service;

    // Состояния для полей редактирования
    const [editedDescription, setEditedDescription] = useState("");
    const [editedDuration, setEditedDuration] = useState("");
    const [editedPrice, setEditedPrice] = useState("");
    //const [editedPhotos, setEditedPhotos] = useState();
    const [editedPhotos, setEditedPhotos] = useState([...masters[0].photos]);

    const handleEditSave = () => {
        // Create an object representing the data to be sent to the server
        const updatedServiceData = {
            id: service.id, // assuming id is the service id
            description: editedDescription,
            duration: editedDuration,
            price: editedPrice,
            imageURLs: editedPhotos.map(photo => photo.url), // assuming editedPhotos has an array of objects with a 'url' property
        };

        // Make a POST request to your server endpoint
        axios.put('http://localhost:5155/executor-service/update', updatedServiceData)
            .then(response => {
/*                // Handle success, e.g., redirect the user to the service page
                navigate(`/service/${id}`);*/
            })
            .catch(error => {
                // Handle error, e.g., show an error message
                console.error('Error saving data:', error);
            });
    };

    const handleAddSave = () => {
        // Create an object representing the data to be sent to the server
        const updatedServiceData = {
            description: editedDescription,
            duration: editedDuration,
            price: editedPrice,
            imageURLs: editedPhotos.map(photo => photo.url), // assuming editedPhotos has an array of objects with a 'url' property
        };

        // Make a POST request to your server endpoint
        axios.post('http://localhost:5155/executor-service/add', updatedServiceData)
            .then(response => {
                /*                // Handle success, e.g., redirect the user to the service page
                                navigate(`/service/${id}`);*/
            })
            .catch(error => {
                // Handle error, e.g., show an error message
                console.error('Error saving data:', error);
            });
    };

    const handleDeletePhoto = (photoId) => {
        const updatedPhotos = editedPhotos.filter(photo => photo.id !== photoId);
        setEditedPhotos(updatedPhotos);
    };

    const handleAddPhoto = () => {
        // Здесь можно реализовать загрузку новой фотографии и добавить ее в editedPhotos
        // Можно использовать библиотеку для загрузки изображений или реализовать свой способ
        // После добавления фото обновите editedPhotos
    };

    return (
        <div className="centrize">
        <div className="service-card-edit">
            {masters.map((master) => (
                <div key={master.id} className="master-card">
                    <div className="photos">
                        <PhotoList photos={editedPhotos} onDeletePhoto={handleDeletePhoto} />
                        <button className="add-photo-button" onClick={handleAddPhoto}>
                            <FontAwesomeIcon icon={faTimesCircle} className="add-photo-icon" />
                        </button>
                    </div>
                    <div className="master-info">
                        <h4>{master.name}</h4>
                        <h4>{master.rating} <FontAwesomeIcon icon={faStar} className='item-icon' /></h4>
                    </div>
                    <div className="service-description">
                        <input
                            type="text"
                            value={editedDescription || master.description}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        <p>Available Slots: {master.availableSlots}</p>
                    </div>
                    <div className="master-info">
                        <FontAwesomeIcon icon={faClock} className = 'item-icon'/>
                        <input
                            type="time"
                            value={editedDuration || master.duration}
                            onChange={(e) => setEditedDuration(e.target.value)}
                        /><h4 className="go-left">min</h4>
                        <input
                            type="number"
                            value={editedPrice || master.price}
                            onChange={(e) => setEditedPrice(e.target.value)}
                        /><h4 className="go-left">Byn</h4>
                    </div>
                    <div>
                        <button className="order-button" onClick={isNew ? handleAddSave : handleEditSave}>
                            <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> Сохранить</p>
                        </button>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default ServiceCard;
