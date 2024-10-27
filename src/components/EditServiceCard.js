import React, {useContext, useEffect, useState} from 'react';
import '../styles/ServiceCard.css';
import {
    faAdd,
    faBoltLightning,
    faStar, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import {useNavigate} from "react-router-dom";
import {useDropzone} from "react-dropzone";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import MapModal from "./MapModal";
import {addServiceCard, getAllServiceTypes, LoadingAnimation, updateServiceCard, uploadMinioPhoto} from "./api";
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";

const ServiceCard = ({ service, isNew, id }) => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const [filesToDelete, setFilesToDelete] = useState([]);

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const [editedDescription, setEditedDescription] = useState(service.description);
    const [editedServiceTypeId, setEditedServiceTypeId] = useState(service.serviceTypeId);
    const [editedDuration] = useState(formatTime(service.duration));
    const [editedPrice] = useState(service.price);
    const [editedAddress, setEditedAddress] = useState(service.place);
    const [editedPhotos, setEditedPhotos] = useState([...service.photos]);
    const [servicesLookupData, setServicesLookupData] = useState([]);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [files, setFiles] = useState([]);
    const { language, translations } = useContext(LanguageContext);
    const [isEditSave, setIsEditSave] = useState(false);
    const [isUpload, setIsUpload] = useState(false);

    const reverseFormatTime = (formattedTime, editedDuration) => {
        const [hours, minutes] = formattedTime.split(':').map(Number);
        const newDate = new Date(editedDuration);
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
        setIsEditSave(true);
        try{
            const updatedServiceData = {
                id: service.id,
                serviceTypeId: service.serviceTypeId,
                executorId: service.executorId,
                description: editedDescription,
                place: editedAddress,
                duration: reverseFormatTime(editedDuration, service.duration),
                price: editedPrice,
                photoIds: editedPhotos.map(photo => photo.id),
                removePhotoIds: filesToDelete,
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
            toast.success(translations[language]['Success'], {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: 'Success',
            });
        }catch (e){
            console.log(e)
        }finally {
            setIsEditSave(false);
        }
    };

    const handleAddSave = () => {
        setIsEditSave(true);
        try{
            const date = new Date(2023,1,1,20, 50,0, 0);
            date.setHours(date.getHours()+3);
            const updatedServiceData = {
                serviceTypeId: editedServiceTypeId.serviceTypeId,
                executorId: id,
                description: editedDescription,
                place: editedAddress,
                duration: reverseFormatTime(editedDuration, date),
                price: editedPrice,
                photoIds: editedPhotos.filter(photo => photo.id !== "default").map(photo => photo.id),
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
            toast.success(translations[language]['Success'], {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: 'Success',
            });
        }catch (e){
            console.log(e)
        }finally {
            setIsEditSave(false);
        }
    };

    const handleAddPhoto = () => {
        setFiles([]);
        setFilesToDelete([]);
        setFiles(editedPhotos.map(photo => ({
            preview: photo.url,
            id: photo.id,
        })));
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
                    if (file.id) { // если файл существующий
                        setFilesToDelete(prev => [...prev, file.id]);
                        setEditedPhotos(prev => prev.filter(photo => photo.id !== file.id));
                    }
                    const newFiles = [...files];
                    newFiles.splice(index, 1);
                    setFiles(newFiles);
                }}><FontAwesomeIcon icon={faTrash} />  {translations[language]['Delete']}</button>
            </div>
        ));

        return (
            <div className="dropzone-centrize">
                {images}
                <div {...getRootProps({className:"dropzoneBorder"})}>
                    <input {...getInputProps()} />
                    <p>{translations[language]['DragAndDrop']}</p>
                </div>
            </div>
        );
    }

    const handleUpload = async () => {
        setIsUpload(true);
        try{
            const newFiles = files.filter(file => !file.id);

            const promises = newFiles.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                return uploadMinioPhoto(navigate, formData);
            });

            const uploadedPhotos = await Promise.all(promises);

            const filteredState = editedPhotos.filter(photo => photo.id && photo.id !== 'default');
            setEditedPhotos([...filteredState, ...uploadedPhotos.map(response => response.data)]);

            setFiles([]);
            setUploadPhotoModal(false);
        }catch (e){
            console.log(e)
        }finally {
            setIsUpload(false);
        }
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
                        <PhotoList photos={editedPhotos} size={window.innerWidth < 700 ? 300 : 480} />
                        <button className="add-photo-button-new" onClick={handleAddPhoto}>
                            <p className="add-photo-text"><FontAwesomeIcon icon={faAdd} /> {translations[language]['AddPhoto']}</p>
                        </button>
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        {isNew ?
                            <select
                                name="procedure"
                                className={`select ${theme === 'dark' ? 'dark' : ''}`}
/*
                                value={editedServiceTypeId.serviceTypeId || service.serviceTypeId}
*/
                                onChange={(e) => setEditedServiceTypeId({ ...editedServiceTypeId, serviceTypeId: e.target.value })}
                            >
                                <option value="">Выберите услугу</option>
                                {servicesLookupData.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                            : <h4>{service.name}</h4>
                        }
                        <h4>{service.rating} <FontAwesomeIcon icon={faStar} className={`item-icon ${theme === 'dark' ? 'dark' : ''}`} /></h4>
                    </div>
                    <div className="service-description">
                        <input
                            style={{width: "95%", borderColor: "#c5c5c5"}}
                            placeholder={translations[language]['Address']}
                            className={`profile-input ${theme === 'dark' ? 'dark' : ''}`}
                            type="text"
                            value={editedAddress.address || service.place.address}
                            onClick={handleAddressClick}
                            readOnly
                        />
                        <br />
                        <br />
                    </div>
                    <div className="service-description">
                        <textarea
                            style={{width: "98%", borderRadius: "5px", borderColor: "#c5c5c5", marginTop: "5px", marginBottom: "5px"}}
                            placeholder={translations[language]['Description']}
                            className={`description-textarea ${theme === 'dark' ? 'dark' : ''}`}
                            type="text"
                            value={editedDescription || service.description}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        <div className={`service-description ${theme === 'dark' ? 'dark' : ''}`}>
                            <p>{translations[language]['AvailableSlots']}: {service.availableSlots}</p>
                        </div>                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4><FontAwesomeIcon icon={faClock} className='item-icon' /> {service.duration}</h4>
                        <h4>{service.price} Byn</h4>
                    </div>
                    <div>
                        <button
                            className="order-button"
                            onClick={isNew ? handleAddSave : handleEditSave}
                            disabled={isEditSave}
                        >
                            {isEditSave ? <LoadingAnimation /> : <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}</p>}
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
                        <div className="dropzone-centrize">
                            <Dropzone />
                            <button
                                className="dropzone-order-button"
                                onClick={handleUpload}
                                disabled={isUpload}
                            >
                                {isUpload ? <LoadingAnimation /> : <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}</p>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <MapModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onSaveAddress={handleSaveAddress}
                initialPosition={editedAddress.position}
                canEdit={true}
            />
        </div>
    );
};

export default ServiceCard;
