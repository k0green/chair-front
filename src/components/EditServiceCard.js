import React, {useContext, useEffect, useState} from 'react';
import '../styles/ServiceCard.css';
import {
    faAdd,
    faBoltLightning,
    faClock, faDollar,
    faLightbulb,
    faStar,
    faTimes,
    faTimesCircle, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {useDropzone} from "react-dropzone";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import MapModal from "./MapModal";
import {addServiceCard, getAllServiceTypes, updateServiceCard, uploadMinioPhoto} from "./api";

const ServiceCard = ({ service, isNew, id }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { masters } = service;

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const [editedDescription, setEditedDescription] = useState(service.description);
    const [editedServiceTypeId, setEditedServiceTypeId] = useState(service.serviceTypeId);
    const [editedDuration, setEditedDuration] = useState(formatTime(service.duration));
    const [editedPrice, setEditedPrice] = useState(service.price);
    const [editedAddress, setEditedAddress] = useState(service.place.address);
    const [editedPhotos, setEditedPhotos] = useState([...service.photos]);
    const [servicesLookupData, setServicesLookupData] = useState([]);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [files, setFiles] = useState([]);
    const { language, translations } = useContext(LanguageContext);

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
        getAllServiceTypes().then(newData => {
            setServicesLookupData(newData);
        })
            .catch(error => {
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
            });

    }, []);

    const handleEditSave = () => {
        const updatedServiceData = {
            id: service.id,
            serviceTypeId: service.serviceTypeId,
            executorId: service.executorId,
            description: editedDescription,
            place: editedAddress,
            duration: reverseFormatTime(editedDuration, service.duration),
            price: editedPrice,
            photos: editedPhotos.map(photo => photo),
        };

        if (!updatedServiceData.serviceTypeId) {
            toast.error("Service type must be filled.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        updateServiceCard(updatedServiceData, navigate)
            .catch(error => {
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
            });
    };

    const handleAddSave = () => {
        const date = new Date(2023,1,1,20, 50,0, 0);
        date.setHours(date.getHours()+3);
        const updatedServiceData = {
            serviceTypeId: editedServiceTypeId.serviceTypeId,
            executorId: id,
            description: editedDescription,
            place: editedAddress,
            duration: reverseFormatTime(editedDuration, date),
            price: editedPrice,
            photos: editedPhotos.map(photo => photo),
        };

        if (!updatedServiceData.serviceTypeId) {
            toast.error("Service type must be filled.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        addServiceCard(updatedServiceData, navigate)
            .catch(error => {
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
            });
    };

    const handleDeletePhoto = (photoId) => {
        const updatedPhotos = editedPhotos.filter(photo => photo.id !== photoId);
        setEditedPhotos(updatedPhotos);
    };

    const handleAddPhoto = () => {
        setUploadPhotoModal(true);
    };

    const Dropzone = () => {
        const { getRootProps, getInputProps } = useDropzone({
            accept: 'image/*',
            onDrop: acceptedFiles => {
                setFiles(prev => [...prev, ...acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                }))]);
            },
            multiple: true
        });

        const images = files.map((file, index) => (
            <div className="dropzone-centrize" key={file.name}>
                <img src={file.preview} style={{width: '50%'}} alt="preview" />
                <button className='trash-icon' onClick={() => {
                    const newFiles = [...files];
                    newFiles.splice(index, 1);
                    setFiles(newFiles);
                }}><FontAwesomeIcon icon={faTrash} />  Удалить</button>
            </div>
        ));

        return (
            <div className="dropzone-centrize">
                {images}
                <div {...getRootProps({style: {border: '2px solid blue', padding: '20px', width: '400px', height: '400px'}})}>
                    <input {...getInputProps()} />
                    <p>{translations[language]['DragAndDrop']}</p>
                </div>
            </div>
        );
    }

    const handleUpload = async () => {
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            let response = null;
            uploadMinioPhoto(navigate, formData)
                .then(serverData => {
                    response = serverData.data.url;
                })
                .catch(error => {
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
                });

            setEditedPhotos(prevState => [...prevState, ...response.data]);
        }

        setFiles([]);
        setUploadPhotoModal(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddressClick = () => {
        setIsModalOpen(true);
    };

    const handleSaveAddress = (address) => {
        setEditedAddress(address);
    };

    return (
        <div className="centrize">
        <div className={`service-card-edit ${theme === 'dark' ? 'dark' : ''}`}>
                <div key={service.id} className="master-card">
                    <div className="photos-edit">
                        <PhotoList photos={editedPhotos} onDeletePhoto={handleDeletePhoto} />
                        <button className="add-photo-button-new" onClick={handleAddPhoto}>
                            <p className="add-photo-text"><FontAwesomeIcon icon={faAdd} /> {translations[language]['AddPhoto']}</p>
                        </button>
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <select
                            name="procedure"
                            className={`select ${theme === 'dark' ? 'dark' : ''}`}
                            value={editedServiceTypeId.serviceTypeId || service.serviceTypeId}
                            onChange={(e) => setEditedServiceTypeId({ ...editedServiceTypeId, serviceTypeId: e.target.value })}
                        >
                            <option value="">Выберите услугу</option>
                            {servicesLookupData.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                        <h4>{service.rating} <FontAwesomeIcon icon={faStar} className={`item-icon ${theme === 'dark' ? 'dark' : ''}`} /></h4>
                    </div>
                    <div className="service-description">
                        <input
                            placeholder={translations[language]['Address']}
                            className={`profile-input ${theme === 'dark' ? 'dark' : ''}`}
                            type="text"
                            value={editedAddress || service.place.address}
                            onClick={handleAddressClick}
                            readOnly
                        />
                        <br />
                        <br />
                    </div>
                    <div className="service-description">
                        <input
                            placeholder={translations[language]['Description']}
                            className={`profile-input ${theme === 'dark' ? 'dark' : ''}`}
                            type="text"
                            value={editedDescription || service.description}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        {/*<p>Available Slots: {service.availableSlots}</p>*/}
                    </div>
                    <div className="master-info">
                        <div className="time-module">
                            <FontAwesomeIcon icon={faClock} className={`item-icon ${theme === 'dark' ? 'dark' : ''}`}/>
                            <input
                                type="time"
                                className={`input-time ${theme === 'dark' ? 'dark' : ''}`}
                                placeholder="50"
                                value={editedDuration || formatTime(service.duration)}
                                onChange={(e) => setEditedDuration(e.target.value)}
                            />
                            <h4 className={`item-icon ${theme === 'dark' ? 'dark' : ''}`}>  min</h4>
                        </div>
                        <div className="time-module">
                            <FontAwesomeIcon icon={faDollar} className={`item-icon ${theme === 'dark' ? 'dark' : ''}`}/>
                            <input
                                type="number"
                                className={`input-number ${theme === 'dark' ? 'dark' : ''}`}
                                value={editedPrice || service.price}
                                onChange={(e) => setEditedPrice(e.target.value)}
                            />
                            <h4 className={`item-icon ${theme === 'dark' ? 'dark' : ''}`}>  Byn</h4>
                        </div>
                    </div>
                    <div>
                        <button className="order-button" onClick={isNew ? handleAddSave : handleEditSave}>
                            <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}</p>
                        </button>
                    </div>
                </div>
        </div>
            {uploadPhotoModal && (
                <div className="filter-modal">
                    <div className="modal-content">
                    <span className="close" onClick={() => setUploadPhotoModal(false)}>
                        &times;
                    </span>
                        <Dropzone />
                        <button className="dropzone-order-button" onClick={handleUpload}><p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}</p></button>
                    </div>
                </div>
            )}
            <MapModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onSaveAddress={handleSaveAddress}
            />
        </div>
    );
};

export default ServiceCard;
