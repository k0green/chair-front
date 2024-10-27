import React, {useContext, useState, useEffect, useRef} from 'react';
import '../styles/ServiceCard.css';
import {
    faBoltLightning, faClock,
    faPencil, faStar, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { LanguageContext } from "./LanguageContext";
import {faHouse} from "@fortawesome/free-solid-svg-icons/faHouse";
import {toast} from "react-toastify";
import {deletePromotionCard, deleteServiceCard} from "./api";
import MapModal from "./MapModal";

const PromotionCard = ({ service, isProfile }) => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const updateItemsPerPage = () => {
            const maxItems = Math.floor(window.innerWidth / 500);
            setItemsPerPage(maxItems);
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);

        return () => {
            window.removeEventListener('resize', updateItemsPerPage);
        };
    }, []);

    const handleMasterNameClickClick = (masterId) => {
        navigate("/profile/" + masterId);
    };

    const handleIsProfileClick = (executorServiceId) => {
        navigate("/promotion-card/edit/" + executorServiceId);
    };

    const handleRemoveClick = (id) => {
        deletePromotionCard(id, navigate).then(newData => {
            const successMessage = "Success"
            if (!toast.isActive(successMessage)) {
                toast.success(successMessage, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: successMessage,
                });
            }
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
/*        window.location.reload();*/
    };

    const TruncatedText = ({ text, maxWidth, handleAddressClick, service }) => {
        const textRef = useRef(null);
        const [isTruncated, setIsTruncated] = useState(false);
        const [truncatedText, setTruncatedText] = useState(text);

        useEffect(() => {
            const span = textRef.current;
            let newText = text;

            while (span.scrollWidth > maxWidth && newText.length > 0) {
                newText = newText.slice(0, -5);
                span.innerText = newText + '...';
            }

            setTruncatedText(newText + '...');
            setIsTruncated(span.scrollWidth > maxWidth);
        }, [text, maxWidth]);

        return (
            <p
                onClick={handleAddressClick}
                style={{ cursor: 'pointer', maxWidth: `${maxWidth}px`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center' }}
            >
                <FontAwesomeIcon icon={faHouse} className='item-icon' />
                <span ref={textRef}>
                {isTruncated ? truncatedText : text}
            </span>
            </p>
        );
    };

    return (
            <div className="card-list">
                    <div key={service.id} className={`service-card ${theme === 'dark' ? 'dark' : ''}`}>
                        <div className="master-card">
                            <div className="photos">
                                {service.photos ? <PhotoList photos={service.photos} size={300} canDelete={false} /> :
                                    <img
                                        src={'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=1024&h=1024&rs=1&pid=ImgDetMain'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=1024&h=1024&rs=1&pid=ImgDetMain';
                                        }}
                                    />}
                            </div>
                            <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                                <h4 style={{ cursor: "pointer" }} onClick={() => handleMasterNameClickClick(service.executorId)}>{service.name}</h4>
                            </div>
                            <div className={`service-description ${theme === 'dark' ? 'dark' : ''}`}>
                                <p>{service.description}</p>
                            </div>
                            <div>
                                {isProfile ?
                                    <div>
                                        <button className="order-button" onClick={() => handleIsProfileClick(service.id)}>
                                            <p className="order-text"><FontAwesomeIcon icon={faPencil} /> {translations[language]['Edit']}</p>
                                        </button>
                                        <br />
                                        <br />
                                        <button style={{ borderColor: 'red' }} className="order-button" onClick={() => handleRemoveClick(service.id)}>
                                            <p style={{ color: 'red' }} className="order-text"><FontAwesomeIcon icon={faTrash} /> {translations[language]['Delete']}</p>
                                        </button>
                                    </div>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                    </div>
            </div>
    );
};

export default PromotionCard;
