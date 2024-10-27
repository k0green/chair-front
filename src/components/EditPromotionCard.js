import React, {useContext, useState} from 'react';
import '../styles/ServiceCard.css';
import {
    faAdd,
    faBoltLightning, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import {useNavigate} from "react-router-dom";
import {useDropzone} from "react-dropzone";
import {ThemeContext} from "./ThemeContext";
import {LanguageContext} from "./LanguageContext";
import {toast} from "react-toastify";
import {
    addPromotionCard, LoadingAnimation,
    updatePromotionCard, uploadMinioPhoto
} from "./api";
import {faCancel} from "@fortawesome/free-solid-svg-icons/faCancel";

const PromotionCard = ({ service, isNew, id }) => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [editedDescription, setEditedDescription] = useState(service.description);
    const [editedPhotos, setEditedPhotos] = useState([...service.photos]);
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
    const [files, setFiles] = useState([]);
    const { language, translations } = useContext(LanguageContext);
    const [isUpload, setIsUpload] = useState(false);
    const [isEditSave, setIsEditSave] = useState(false);

    const handleEditSave = () => {
        setIsEditSave(true);
        try{
            const updatedServiceData = {
                id: service.id,
                executorId: service.executorId,
                description: editedDescription,
                photoIds: editedPhotos.map(photo => photo.id),
                removePhotoIds: filesToDelete,
            };

            updatePromotionCard(updatedServiceData, navigate)
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

    const handleCancel = () => {
        navigate("/profile")
    };

    const handleAddSave = () => {
        setIsEditSave(true);
        try{
            const date = new Date(2023,1,1,20, 50,0, 0);
            date.setHours(date.getHours()+3);
            const updatedServiceData = {
                executorId: id,
                description: editedDescription,
                photoIds: editedPhotos.filter(photo => photo.id !== "default").map(photo => photo.id),
            };

            addPromotionCard(updatedServiceData, navigate)
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
                <div {...getRootProps({style: {border: '2px solid blue', borderRadius: "10px", padding: '20px', minWidth: "200px", minHeight: "200px", width: '30%'}})}>
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
            console.log(e);
        }finally {
            setIsUpload(false);
        }
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
                    </div>
                    <div className="service-description">
                        <br />
                        <br />
                    </div>
                    <div className="service-description">
                        <textarea
                            style={{width: "98%", height: "16ch", borderRadius: "10px", borderColor: "#c5c5c5", marginTop: "30px", marginBottom: "40px"}}
                            placeholder={translations[language]['Description']}
                            className={`description-textarea ${theme === 'dark' ? 'dark' : ''}`}
                            type="text"
                            value={editedDescription || service.description}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        <div className={`service-description ${theme === 'dark' ? 'dark' : ''}`}>
                        </div>
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
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
        </div>
    );
};

export default PromotionCard;
