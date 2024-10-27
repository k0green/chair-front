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
import ServiceCard from "./ServiceCard";
import {addReview, getReviewsByServiceCardId, LoadingAnimation, updateReview, uploadMinioPhoto} from "./api";
import {toast} from "react-toastify";
import {useDropzone} from "react-dropzone";
import {
    faBoltLightning,
    faStar, faTrash
} from "@fortawesome/free-solid-svg-icons";
import PhotoList from "./PhotoList";

const Reviews = ({ service }) => {
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
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

    const handleUpload = () => {
        setIsUpload(true);
        try{
            const date = new Date(2023,1,1,20, 50,0, 0);
            date.setHours(date.getHours()+3);
            console.log(date);
            const updatedReviewData = {
                userId: localStorage.getItem('userId'),
                executorServiceId: service.id,
                text: editedText,
                stars: editedStars,
                parentId: editedParentId,
            };

            if(isEdit){
                updatedReviewData.id = editedId;
                updatedReviewData.createDate = createDate;
                updateReview(updatedReviewData, navigate)
                    .then(() => {
                        setUploadReviewModal(false);
                        fetchData();
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
                addReview(updatedReviewData, navigate)
                    .then(() => {
                        setUploadReviewModal(false);
                        fetchData();
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
        setUploadReviewModal(true);
    };

    const handleEditClick = (id) => {
        setUploadReviewModal(true);
        const review = reviews.find(review => review.id === id);
        setEditedText(review.text);
        setEditedStars(review.stars);
        setEditedParentId(review.parentId);
        setEditedId(review.id);
        setCreateDate(review.createDate);
        setEditedPhotos(review.photos)
        setIsEdit(true);
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

            setFiles([]);
        }catch (e){
            console.log(e)
        }finally {
            setIsUploadImages(false);
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

    return (
        <div className="service-and-reviews-container">
            <ServiceCard key={service.id} service={service} isProfile={false}/>
            {uploadReviewModal && (
                <div className={`filter-modal ${theme === 'dark' ? 'dark' : ''}`}>
                    <div className={`modal-content ${theme === 'dark' ? 'dark' : ''}`}>
            <span className="close" onClick={() => setUploadReviewModal(false)}>
                &times;
            </span>
                        <div className="filter-modal">
                            <div className="modal-content">
                                <div className="dropzone-centrize">
                                    <Dropzone />
                                    <button
                                        className="dropzone-order-button"
                                        onClick={handleUploadImages}
                                        disabled={isUploadImages}
                                    >
                                        {isUploadImages ? <LoadingAnimation /> : <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}</p>}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="extra-modal-content">
                            <ReactStars
                                count={5}
                                value={editedStars}
                                onChange={(newRating) => setEditedStars(newRating)}
                                size={128}
                                activeColor="#ffd700"
                            />
                            <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                placeholder={translations[language]['EnterReview']}
                                className={`review-input ${theme === 'dark' ? 'dark' : ''}`}
                            />
                            <button className="review-order-button" onClick={handleUpload} disabled={isUpload}>
                                {isUpload ? <LoadingAnimation /> : <p className="order-text">
                                    <FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}
                                </p>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="service-and-reviews-container">
                <div className="photos-fullsize">
                    {reviews.filter(obj => obj.photos).flatMap(obj => obj.photos)
                        ? <PhotoList photos={reviews.filter(obj => obj.photos).flatMap(obj => obj.photos)} size={500}  canDelete={false} /> :
                        <img
                            src={'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=1024&h=1024&rs=1&pid=ImgDetMain'}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=1024&h=1024&rs=1&pid=ImgDetMain';
                            }}
                            alt=""/>}
                </div>
                <div style={{marginTop: "10px"}}>
                    <button className="order-button" onClick={handleAddClick} disabled={isUpload}>
                        {isUpload ? <LoadingAnimation /> : <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Add']}</p>}
                    </button>

                    <div className={`reviews-background ${theme === 'dark' ? 'dark' : ''}`}>
                        <div className="reviews-panel">
                            {reviews.map(review => (
                                <div key={review.id} className="review-card">
                                    {review.photos
                                        ? <PhotoList photos={review.photos} size={200}  canDelete={false} /> :
                                        <img
                                            src={'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=1024&h=1024&rs=1&pid=ImgDetMain'}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=1024&h=1024&rs=1&pid=ImgDetMain';
                                            }}
                                            alt=""/>}
                                    <div className="review-header">
                                        <div>
                                            <span className={`user-name ${theme === 'dark' ? 'dark' : ''}`}>{review.userName}</span>
                                            <span className="review-date">{new Date(review.createDate).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            { localStorage.getItem('userId') === review.userId ? <FontAwesomeIcon className={`edit-review ${theme === 'dark' ? 'dark' : ''}`} icon={faEdit} onClick={()=>handleEditClick(review.id)}/> : ''}
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
                    <h4>Overall Rating</h4>
                    <p>⭐⭐⭐⭐⭐   {reviews.length > 0 ? calculateAverageRating(reviews) : 5} / 5</p>
                    <ul>
                        {calculateStarCounts(reviews).map((item, index) => (
                            <li key={index}>
                                <span>{item.stars} stars</span>
                                <ProgressBar now={item.percentage} label={item.count} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
