import React, {useContext, useEffect, useState} from 'react';
import '../styles/ServiceCard.css';
import '../styles/Reviews.css';
import {
    faBoltLightning,
    faClock, faEdit,
    faHouse, faPencil,
    faStar, faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import {useNavigate} from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {LanguageContext} from "./LanguageContext";
import {ThemeContext} from "./ThemeContext";
import axios from "axios";
import ReactStars from "react-rating-stars-component";

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
    try {
        const response = axios.get(`http://localhost:5155/review/${service.id}`).then(response =>{
            const formattedData = response.data.map(review => ({
                id: review.id,
                executorServiceId: review.executorServiceId,
                userId: review.userId,
                userName: review.userName,
                text: review.text,
                stars: review.stars,
                createDate: review.createDate
            }));
            setReviews(formattedData);
            console.log(reviews);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

    const handleOrderClick = (executorServiceId) => {
        navigate("/calendar/"+ executorServiceId);
    };

    let handleMasterNameClickClick = (masterId) => {
        navigate("/profile/" + masterId);
    };

    /*const reviews = [
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервиутщуи трфущцрткщ хфцмэфц уощцфпи" +
                "омиш щцф рзук рихфц" +
                "вумр тфгщцр зугшкфрц мишщц" +
                "мфыд вутмошцр пущ" +
                "ъмыол цфз мшкукм" +
                "мцлуми рфгшцпр" +
                "мфодцмр шцфгпрс!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервиутщуи трфущцрткщ хфцмэфц уощцфпи" +
                "омиш щцф рзук рихфц" +
                "вумр тфгщцр зугшкфрц мишщц" +
                "мфыд вутмошцр пущ" +
                "ъмыол цфз мшкукм" +
                "мцлуми рфгшцпр" +
                "мфодцмр шцфгпрс!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
        {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            executorServiceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            userId: "string",
            userName: "Alex",
            text: "Отличный сервис!",
            stars: 5,
            createDate: "2024-03-04T10:18:13.267Z",
        },
    ];*/

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

        let url = '';
        if(isEdit){
            url = 'http://localhost:5155/review/update';
            updatedReviewData.id = editedId;
            updatedReviewData.createDate = createDate;
            axios.put(url, updatedReviewData)
                .then(response => {
                    setUploadReviewModal(false);
                    fetchData();
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                });
        }
        else{
            url = 'http://localhost:5155/review/add';
            axios.post(url, updatedReviewData)
                .then(response => {
                    setUploadReviewModal(false);
                    fetchData();
                })
                .catch(error => {
                    console.error('Error saving data:', error);
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
            <div className={`service-card ${theme === 'dark' ? 'dark' : ''}`}>
                <div key={service.id} className="master-card">
                    <div className="photos-edit">
                        {service.photos ? <PhotoList photos={service.photos}/> : null}
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4 onClick={() => handleMasterNameClickClick(service.executorId)}>{service.name}</h4>
                        <h4>{service.rating} <FontAwesomeIcon icon={faStar} className = 'item-icon'/></h4>
                    </div>
                    <div className={`service-description ${theme === 'dark' ? 'dark' : ''}`}>
                        <p>{service.description}</p>
                        <p><FontAwesomeIcon icon={faHouse} className = 'item-icon'/>{service.address}</p>
                        <p>{translations[language]['AvailableSlots']}: {service.availableSlots}</p>
                    </div>
                    <div className={`master-info ${theme === 'dark' ? 'dark' : ''}`}>
                        <h4><FontAwesomeIcon icon={faClock} className = 'item-icon'/> {service.duration}</h4>
                        <h4>{service.price} Byn</h4>
                    </div>
                    <div>

                            <button className="order-button" onClick={()=>handleOrderClick(service.id)}>
                                <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} />    {translations[language]['MakeAnAppointment']}</p>
                            </button>
                    </div>
                </div>
            </div>
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
