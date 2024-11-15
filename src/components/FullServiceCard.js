import React, {useContext, useEffect, useState} from 'react';
import '../styles/ServiceCard.css';
import '../styles/Reviews.css';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {LanguageContext} from "./LanguageContext";
import {ThemeContext} from "./ThemeContext";
import ReactStars from "react-rating-stars-component";
import {addReview, getReviewsByServiceCardId, LoadingAnimation, updateReview, uploadMinioPhoto} from "./api";
import {toast} from "react-toastify";
import Calendar from "./Calendar";
import PhotoList from "./PhotoList";
import MapComponent from "./MapComponent";
import {useDropzone} from "react-dropzone";
import {
    faBoltLightning,
    faStar, faTrash
} from "@fortawesome/free-solid-svg-icons";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import Cookies from "js-cookie";
import InfoTooltip from "./InfoTooltip";

const FullServiceCard = ({ service }) => {
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const { theme } = useContext(ThemeContext);
    const [uploadReviewModal, setUploadReviewModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [editedText, setEditedText] = useState('');//useState(service.description);
    const [editedStars, setEditedStars] = useState(0);
    const [editedParentId, setEditedParentId] = useState(null);
    const [editedId, setEditedId] = useState(null);
    const [createDate, setCreateDate] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isUpload, setIsUpload] = useState(false);
    const [isUploadImages, setIsUploadImages] = useState(false);
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [files, setFiles] = useState([]);
    const [editedPhotos, setEditedPhotos] = useState([]);
    const token = Cookies.get('token');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getReviewsByServiceCardId(service.id, navigate).then(newData => {
            setReviews(newData);
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
    };

    function calculateStarCounts(reviews) {
        const starCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

        for (let review of reviews) {
            starCounts[review.stars]++;
        }

        const totalReviews = reviews.length;

        return Object.entries(starCounts).map(([stars, count]) => ({
            stars,
            count,
            percentage: (count / totalReviews) * 100,
        }));
    }

    function calculateAverageRating(reviews) {
        const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);

        const averageRating = totalStars / reviews.length;

        return Math.round(averageRating * 100) / 100;
    }

    function ProgressBar({ now, label }) {
        return (
            <div style={{ width: '100%', backgroundColor: '#f3f3f3', borderRadius: '50px' }}>
                <div style={{
                    height: '20px',
                    width: `${now}%`,
                    backgroundColor: '#007bff',
                    borderRadius: 'inherit',
                    textAlign: 'right'
                }}>
        <span style={{
            padding: '5px',
            color: 'white',
            fontWeight: 'bold'
        }}>
          {label}
        </span>
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

            setFiles([]);

            const date = new Date(2023,1,1,20, 50,0, 0);
            date.setHours(date.getHours()+3);
            const updatedReviewData = {
                userId: localStorage.getItem('userId'),
                executorServiceId: service.id,
                text: editedText,
                stars: editedStars,
                parentId: editedParentId,
                photoIds: [...filteredState, ...uploadedPhotos.map(response => response.data).map(photo => photo.id)],
                removePhotoIds: filesToDelete,
            };

            if(isEdit){
                updatedReviewData.id = editedId;
                updatedReviewData.createDate = createDate;
                updateReview(updatedReviewData, navigate)
                    .then(() => {
                        setUploadReviewModal(false);
                        fetchData();
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
            }
            else{
                console.log(editedPhotos);
                addReview(updatedReviewData, navigate)
                    .then(() => {
                        setUploadReviewModal(false);
                        fetchData();
                    })
                toast.success(translations[language]['Success'], {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: 'Success',
                });
            }
        }catch (e){
            console.log(e)
        }finally {
            setIsUpload(false);
        }
    };

    const handleAddClick = () => {
        setFiles([]);
        setFilesToDelete([]);
        console.log('-+-+-');
        console.log(editedPhotos);
        setFiles(editedPhotos.map(photo => ({
            preview: photo.url,
            id: photo.id,
        })));
        setUploadReviewModal(true);
    };

    const handleEditClick = (id) => {
        const review = reviews.find(review => review.id === id);
        setEditedText(review.text);
        setEditedStars(review.stars);
        setEditedParentId(review.parentId);
        setEditedId(review.id);
        setCreateDate(review.createDate);
        setEditedPhotos(review.photos)
        setFiles(review.photos.map(photo => ({
            preview: photo.url,
            id: photo.id,
        })));
        setIsEdit(true);
        setUploadReviewModal(true);
    };

    const handleMasterNameClickClick = (masterId) => {
        navigate("/profile/" + masterId);
    };

    const handleUploadImages = async () => {
        setIsUploadImages(true);
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
            console.log(1);
            console.log(uploadedPhotos);

            setFiles([]);
            console.log(9);
            console.log(editedPhotos);
        }catch (e){
            console.log(e)
        }finally {
            setIsUploadImages(false);
            console.log(10);
            console.log(editedPhotos);
        }
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

    return (
        <div>
            <div className="service-and-reviews-container">
                <div className="photos-fullsize">
                    {service.photos ? <PhotoList photos={service.photos} size={300} canDelete={false} /> : ""}
                    {service.hasDiscount || service.hasPromotions ? (
                        <div className="discount-overlay">
                            {service.hasDiscount ? <h4 className="discount">{translations[language]['Discount']}</h4> : ""}
                            {service.hasPromotions ? <h4 className="discount">{translations[language]['Promotions']}</h4> : ""}
                        </div>
                    ) : null}
                </div>
                <div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4 style={{ cursor: "pointer" }} onClick={() => handleMasterNameClickClick(service.executorId)}>{translations[language]['Name']}: {service.name}</h4>
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4 style={{ cursor: "pointer" }} onClick={() => handleMasterNameClickClick(service.executorId)}>{translations[language]['Name']}: {service.serviceTypeName}</h4>
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4 style={{ cursor: "pointer" }}>
                            {translations[language]['Rating']}: {service.rating < 1 ? '-' : service.rating} <FontAwesomeIcon icon={faStar} className='item-icon' />
                        </h4>
                    </div>
                    <div className={`service-description ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4>{translations[language]['Description']}: {service.description}</h4>
                        <h4>{translations[language]['Address']}: {service.place.address}</h4>
                        <h4>{translations[language]['AvailableSlots']}: {service.availableSlots}</h4>
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4>{translations[language]['Duration(h:m)']}: {service.duration}</h4>
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4>{translations[language]['Cost']}: {service.price} Byn <InfoTooltip text="Сумма и продолжительность рассчитывается приблизительно, исходя из записей на текущий месяц!"/></h4>
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "center", flexDirection: "column", maxWidth: "500px", width: "95%"}}>
                    <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: "10px", maxWidth: "500px" }}>
                        <MapComponent
                            initialPosition={service.place.position}
                            canEdit={false}
                        />
                    </div>
                </div>
            </div>
            {token ? <Calendar full={false} /> : ""}
            {/*<Calendar full={false} />*/}
            <div className="service-and-reviews-container">
                <div className="photos-fullsize" style={{marginBottom: "20px"}}>
                    {reviews.filter(obj => obj.photos).flatMap(obj => obj.photos)
                        ? <PhotoList photos={reviews.filter(obj => obj.photos).flatMap(obj => obj.photos)} size={300}  canDelete={false} /> :
                        ""}
                </div>
                <div className={`filter-overlay ${uploadReviewModal ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                    <div className="filter-content">
                        <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                            <FontAwesomeIcon icon={faXmark} onClick={() => setUploadReviewModal(false)} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                        </div>
                        <div className={"price-filter"} style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                            <ReactStars
                                count={5}
                                value={editedStars}
                                onChange={(newRating) => setEditedStars(newRating)}
                                size={64}
                                activeColor="#ffd700"
                            />
                        </div>
                        <div className={"price-filter"} style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                            <Dropzone />
                        </div>
                        <div className={"price-filter"} style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                            <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                placeholder={translations[language]['EnterReview']}
                                className={`review-input ${theme === 'dark' ? 'dark' : ''}`}
                            />
                        </div>
                    </div>
                    <div className="price-inputs">
                        <div className="input-group">
                            <button className="filter-button"
                                    onClick={handleUpload}
                                    disabled={isUpload}
                            >
                                {isUpload ? <LoadingAnimation /> : <>
                                    <FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}</>}
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{marginTop: "10px"}}>
                    {token ?
                    <button className="order-button" onClick={handleAddClick} disabled={isUpload}>
                        {isUpload ? <LoadingAnimation /> : <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Add']}</p>}
                    </button> : ""}

                    <div className={`reviews-background ${theme === 'dark' ? 'dark' : ''}`}>
                        <div className="reviews-panel">
                            {reviews.map(review => (
                                <div key={review.id} className="review-card">
                                    {review.photos
                                        ? <PhotoList photos={review.photos} size={200} canDelete={false} /> : ""}
                                    <div className="review-header">
                                        <div>
                                            <span className={`user-name ${theme === 'dark' ? 'dark' : ''}`}>{review.userName}</span>
                                            <span className="review-date">{new Date(review.createDate).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            {localStorage.getItem('userId') === review.userId ?
                                                <FontAwesomeIcon className={`edit-review ${theme === 'dark' ? 'dark' : ''}`} icon={faEdit} onClick={() => handleEditClick(review.id)} /> : ''}
                                            <span className={`stars ${theme === 'dark' ? 'dark' : ''}`}>{`${review.stars} ⭐`}</span>
                                        </div>
                                    </div>
                                    <p className={`review-text ${theme === 'dark' ? 'dark' : ''}`}>{review.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="reviews-summary">
                    <h4 style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>Overall Rating</h4>
                    <p style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>⭐⭐⭐⭐⭐   {reviews.length > 0 ? calculateAverageRating(reviews) : 5} / 5</p>
                    <ul>
                        {calculateStarCounts(reviews).map((item, index) => (
                            <li key={index}>
                                <span style={theme === 'dark' ? { color: "white" } : { color: "#000" }}>{item.stars} stars</span>
                                <ProgressBar now={item.percentage} label={item.count} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FullServiceCard;
