import React, {useContext, useEffect, useState} from 'react';
import '../styles/ServiceCard.css';
import '../styles/Reviews.css';
import {faBoltLightning, faEdit} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {LanguageContext} from "./LanguageContext";
import {ThemeContext} from "./ThemeContext";
import ReactStars from "react-rating-stars-component";
import ServiceCard from "./ServiceCard";
import {addReview, getReviewsByServiceCardId, updateReview} from "./api";
import {toast} from "react-toastify";

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
                .then(response => {
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
        }
        else{
            addReview(updatedReviewData, navigate)
                .then(response => {
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
        setIsEdit(true);
    };


    return (
        <div className="service-and-reviews-container">
            <ServiceCard key={service.id} service={service} isProfile={false}/>
            {uploadReviewModal && (
                <div className={`filter-modal ${theme === 'dark' ? 'dark' : ''}`}>
                    <div className={`modal-content ${theme === 'dark' ? 'dark' : ''}`}>
            <span className="close" onClick={() => setUploadReviewModal(false)}>
                &times;
            </span>
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
                            <button className="review-order-button" onClick={handleUpload}>
                                <p className="order-text">
                                    <FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Save']}
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div style={{marginTop: "10px"}}>
                <button className="order-button" onClick={handleAddClick}>
                    <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['Add']}</p>
                </button>
                <div className={`reviews-background ${theme === 'dark' ? 'dark' : ''}`}>
                    <div className="reviews-panel">
                        {reviews.map(review => (
                            <div key={review.id} className="review-card">
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
    );
};

export default Reviews;
