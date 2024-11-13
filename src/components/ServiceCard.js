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
import {deleteServiceCard} from "./api";
import MapModal from "./MapModal";

const ServiceCard = ({ service, isProfile }) => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);
    const [selectedPlace, setSelectedPlace] = useState({ position: null, address: '' });
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

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

    const handleOrderClick = (executorServiceId) => {
        const userRole = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');
        if(userRole === 'executor' && userId === service.userId)
            navigate("/calendar/full/edit");
        else
            navigate("/calendar/" + executorServiceId);
    };

    const handleReviewClick = (executorServiceId) => {
        navigate("/reviews/" + executorServiceId);
    };

    const handleMasterNameClickClick = (masterId) => {
        navigate("/profile/" + masterId);
    };

    const handleIsProfileClick = (executorServiceId) => {
        navigate("/service-card/edit/" + executorServiceId);
    };

    const handleCardClick = (executorServiceId) => {
        navigate("/service-card/full/" + executorServiceId);
    };

    const handleRemoveClick = (id) => {
        setIsDelete(true);
        try{
            deleteServiceCard(id, navigate).then(newData => {
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
            });
        }catch (e){
            console.log(e)
        }finally {
            setIsDelete(false)
        }
    };

    const handleAddressClick = () => {
        setIsModalOpen(true);
    };

    const TruncatedText = ({ text, icon, maxWidth, handleAddressClick, service }) => {
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
                {icon ? <FontAwesomeIcon icon={faHouse} className='item-icon' /> : ''}
                <span ref={textRef}>
                {isTruncated ? truncatedText : text}
            </span>
            </p>
        );
    };

    return (
        <div className="card-list" onClick={() => handleCardClick(service.id)}>
            <div key={service.id} className={`service-card ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="master-card">
                    <div className="photos">
                        {service.photos ? <PhotoList photos={service.photos} size={300}  canDelete={false} /> :
                            <img
                                src={'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=1024&h=1024&rs=1&pid=ImgDetMain'}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://th.bing.com/th/id/OIG1.BFC0Yssw4i_ZI54VYkoa?w=1024&h=1024&rs=1&pid=ImgDetMain';
                                }}
                            />}
                            <div className="discount-overlay">
                               <h4 className="discount" style={{backgroundColor: "#007bff"}}>{service.serviceTypeName}</h4>
                            </div>
                        {service.hasDiscount || service.hasPromotions ? (
                            <div className="discount-overlay">
                                {service.hasDiscount ? <h4 className="discount">{translations[language]['Discount']}</h4> : ""}
                                {service.hasPromotions ? <h4 className="discount">{translations[language]['Promotions']}</h4> : ""}
                            </div>
                        ) : null}
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4 style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); handleMasterNameClickClick(service.executorId); }}>{service.name}</h4>
                        <h4 style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); handleCardClick(service.id); }}>
                            {service.rating < 1 ? '-' : service.rating} <FontAwesomeIcon icon={faStar} className='item-icon' />
                        </h4>
                    </div>
                    <div className={`service-description ${theme === 'dark' ? 'dark' : ''}`}>
                        <p>{service.description}</p>
                        <TruncatedText text={service.place.address} maxWidth={270} handleAddressClick={(e) => { e.stopPropagation(); handleAddressClick(); }}/>
                        <p>{translations[language]['AvailableSlots']}: {service.availableSlots}</p>
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4><FontAwesomeIcon icon={faClock} className='item-icon' /> {service.duration}</h4>
                        <h4>{service.price} Byn</h4>
                    </div>
                    <div>
                        {isProfile ?
                            <div>
                                <button className="order-button" onClick={(e) => { e.stopPropagation(); handleIsProfileClick(service.id); }}>
                                    <p className="order-text"><FontAwesomeIcon icon={faPencil} /> {translations[language]['Edit']}</p>
                                </button>
                                <br />
                                <br />
                                <button style={{ borderColor: 'red' }} className="order-button" onClick={(e) => { e.stopPropagation(); handleRemoveClick(service.id); }}>
                                    <p style={{ color: 'red' }} className="order-text"><FontAwesomeIcon icon={faTrash} /> {translations[language]['Delete']}</p>
                                </button>
                            </div>
                            :
                            <button className="order-button" onClick={(e) => { e.stopPropagation(); handleOrderClick(service.id); }}>
                                <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} /> {translations[language]['MakeAnAppointment']}</p>
                            </button>
                        }
                    </div>
                </div>
            </div>
            <MapModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                initialPosition={service.place.position}
            />
        </div>
    );
};

export default ServiceCard;
