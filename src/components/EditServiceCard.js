import React, {useEffect, useState} from 'react';
import '../styles/ServiceCard.css';
import { faBoltLightning, faClock, faLightbulb, faStar, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const ServiceCard = ({ service, isNew, id }) => {
    const navigate = useNavigate();
    const { masters } = service;

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Состояния для полей редактирования
    const [editedDescription, setEditedDescription] = useState(service.description);
    const [editedServiceTypeId, setEditedServiceTypeId] = useState(service.serviceTypeId);
    const [editedDuration, setEditedDuration] = useState(formatTime(service.duration));
    const [editedPrice, setEditedPrice] = useState(service.price);
    const [editedAddress, setEditedAddress] = useState(service.address);
    //const [editedPhotos, setEditedPhotos] = useState();
    const [editedPhotos, setEditedPhotos] = useState([...service.imageURLs]);
    const [servicesLookupData, setServicesLookupData] = useState([]);

    const reverseFormatTime = (formattedTime, editedDuration) => {
        const [hours, minutes] = formattedTime.split(':').map(Number);
        const newDate = new Date(editedDuration);
        console.log("new "+ formattedTime);
        console.log("old "+ editedDuration);
        newDate.setHours(hours+3);
        newDate.setMinutes(minutes);
        return newDate;
    };

    useEffect(() => {
        const token = Cookies.get('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('http://localhost:5155/service-types/get-all')
                .then(response => {
                    const serverData = response.data.map(item => ({
                        id: item.id,
                        name: item.name
                    }));
                    setServicesLookupData(serverData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

        }, []);

    const handleEditSave = () => {
        // Create an object representing the data to be sent to the server
        const updatedServiceData = {
            id: service.id,
            serviceTypeId: service.serviceTypeId,
            executorId: service.executorId,
            description: editedDescription,
            address: editedAddress,
            duration: reverseFormatTime(editedDuration, service.duration),
            price: editedPrice,
            imageURLs: editedPhotos.map(photo => photo.url),
        };
        const token = Cookies.get('token');
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Make a POST request to your server endpoint
            axios.put('http://localhost:5155/executor-service/update', updatedServiceData)
                .then(response => {
                    // Handle success, e.g., redirect the user to the service page
                    navigate(`/profile`);
                })
                .catch(error => {
                    // Handle error, e.g., show an error message
                    console.error('Error saving data:', error);
                });
        }
    };

    const handleAddSave = () => {
        const date = new Date(2023,1,1,20, 50,0, 0);
        date.setHours(date.getHours()+3);
        console.log(date);
        const updatedServiceData = {
            serviceTypeId: editedServiceTypeId.serviceTypeId,
            executorId: id,
            description: editedDescription,
            address: editedAddress,
            duration: reverseFormatTime(editedDuration, date),
            price: editedPrice,
            imageURLs: editedPhotos.map(photo => photo.url), // assuming editedPhotos has an array of objects with a 'url' property
        };

        // Make a POST request to your server endpoint
        axios.post('http://localhost:5155/executor-service/add', updatedServiceData)
            .then(response => {
                navigate("/profile")
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
                <div key={service.id} className="master-card">
                    <div className="photos">
                        <PhotoList photos={editedPhotos} onDeletePhoto={handleDeletePhoto} />
                        <button className="add-photo-button" onClick={handleAddPhoto}>
                            <FontAwesomeIcon icon={faTimesCircle} className="add-photo-icon" />
                        </button>
                    </div>
                    <div className="master-info">
                        <select
                            name="procedure"
                            value={editedServiceTypeId.serviceTypeId}
                            onChange={(e) => setEditedServiceTypeId({ ...editedServiceTypeId, serviceTypeId: e.target.value })}
                        >
                            <option value="">Выберите услугу</option>
                            {servicesLookupData.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                        {/*<h4>{service.name}</h4>*/}
                        <h4>{service.rating} <FontAwesomeIcon icon={faStar} className='item-icon' /></h4>
                    </div>
                    <div className="service-description">
                        <input
                            placeholder="address"
                            type="text"
                            value={editedAddress || service.address}
                            onChange={(e) => setEditedAddress(e.target.value)}
                        />
                        <br/>
                        <br/>
                    </div><div className="service-description">
                        <input
                            placeholder="Duration"
                            type="text"
                            value={editedDescription || service.description}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        <p>Available Slots: {service.availableSlots}</p>
                    </div>
                    <div className="master-info">
                        <FontAwesomeIcon icon={faClock} className = 'item-icon'/>
                        <input
                            type="time"
                            placeholder="50"
                            value={editedDuration || formatTime(service.duration)}
                            onChange={(e) => setEditedDuration(e.target.value)}
                        /><h4 className="go-left">min</h4>
                        <input
                            type="number"
                            value={editedPrice || service.price}
                            onChange={(e) => setEditedPrice(e.target.value)}
                        /><h4 className="go-left">Byn</h4>
                    </div>
                    <div>
                        <button className="order-button" onClick={isNew ? handleAddSave : handleEditSave}>
                            <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> Сохранить</p>
                        </button>
                    </div>
                </div>
        </div>
        </div>
    );
};

export default ServiceCard;
