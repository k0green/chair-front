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
import {faCancel} from "@fortawesome/free-solid-svg-icons/faCancel";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faSave} from "@fortawesome/free-solid-svg-icons/faSave";

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
                duration: new Date(2023,1,1,20, 50,0, 0),//reverseFormatTime(editedDuration, service.duration),
                price: 0,
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
                serviceTypeId: service.serviceTypeId,
                executorId: id,
                description: editedDescription,
                place: editedAddress,
                duration: date,//reverseFormatTime(editedDuration, date),
                price: 0,
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

    const handleCancel = () => {
        navigate("/profile")
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
            <div className="price-filter" key={file.name} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                    <FontAwesomeIcon icon={faTrash} onClick={() => {
                        if (file.id) { // если файл существующий
                            setFilesToDelete(prev => [...prev, file.id]);
                            setEditedPhotos(prev => prev.filter(photo => photo.id !== file.id));
                        }
                        const newFiles = [...files];
                        newFiles.splice(index, 1);
                        setFiles(newFiles);
                    }} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "#ff0000" } : { color: "#ff0000" })}}/>
                </div>
                <img src={file.preview} style={{width: '50%'}} alt="preview" />
            </div>
        ));

        return (
            <div className="dropzone-centrize">
                <div {...getRootProps({style: {border: '2px solid blue', borderRadius: "10px", padding: '20px', minWidth: "200px", minHeight: "200px", width: '30%'}})}>
                    <input {...getInputProps()} />
                    <p>{translations[language]['DragAndDrop']}</p>
                </div>
                {images}
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
                    <div className="service-description" style={{marginTop: "30px", marginBottom: "10px"}}>
                        <input
                            style={{width: "95%", borderColor: "#c5c5c5"}}
                            placeholder={translations[language]['Address']}
                            className={`profile-input ${theme === 'dark' ? 'dark' : ''}`}
                            type="text"
                            value={editedAddress.address || service.place.address}
                            onClick={handleAddressClick}
                            readOnly
                        />
                    </div>
                    <div className="service-description" style={{marginBottom: "0px"}}>
                        <textarea
                            style={{width: "99%", borderRadius: "5px", height: "16ch", borderColor: "#c5c5c5", ...(theme === 'dark' ? { backgroundColor: "#695b5b", color: "#fff" } : { backgroundColor: "#ffffff", color: "fff" })}}
                            placeholder={translations[language]['Description']}
                            className={`description-textarea ${theme === 'dark' ? 'dark' : ''}`}
                            type="text"
                            value={editedDescription || service.description}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            className="order-button"
                            onClick={isNew ? handleAddSave : handleEditSave}
                            disabled={isEditSave}
                        >
                            {isEditSave ? <LoadingAnimation /> : <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}</p>}
                        </button>
                        <button
                            className="order-button"
                            onClick={handleCancel}
                            disabled={isEditSave}
                            style={{ borderColor: "red", marginTop: "20px" }}
                        >
                            {isEditSave ? <LoadingAnimation /> : <p style={{ color: "red" }} className="order-text"><FontAwesomeIcon icon={faCancel} /> {translations[language]['Cancel']}</p>}
                        </button>
                    </div>
                </div>
        </div>
            <div className={`filter-overlay ${uploadPhotoModal ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="filter-content">
                    <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                        <FontAwesomeIcon icon={faXmark} onClick={() => setUploadPhotoModal(false)} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                        <Dropzone />
                    </div>
                    <div className="price-inputs">
                        <div className="input-group" style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                            <button className="filter-button"
                                    onClick={handleUpload}
                                    disabled={isUpload}
                            >
                                {isUpload ? <LoadingAnimation /> : <><FontAwesomeIcon icon={faSave} /> {translations[language]['Save']}</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
