import React, {useEffect, useState} from 'react';
import '../styles/ServiceCard.css';
import '../styles/Reviews.css';
import {
    faBoltLightning,
    faClock,
    faHouse,
    faLightbulb,
    faStar,
    faTimes,
    faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhotoList from "../components/PhotoList";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ProgressBar from 'react-bootstrap/ProgressBar';

const Reviews = ({ service, }) => {
    const navigate = useNavigate();

    const handleOrderClick = (executorServiceId) => {
        navigate("/calendar/"+ executorServiceId);
    };

    let handleMasterNameClickClick = (masterId) => {
        navigate("/profile/" + masterId);
    };

    const reviews = [
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
    ];

    function calculateStarCounts(reviews) {
        // Initialize a dictionary to store the count of each star rating
        const starCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

        // Iterate over the reviews
        for (let review of reviews) {
            // Increment the count of the star rating of the current review
            starCounts[review.stars]++;
        }

        // Calculate the total number of reviews
        const totalReviews = reviews.length;

        // Return the star counts as a list of objects for easier use in the JSX code
        return Object.entries(starCounts).map(([stars, count]) => ({
            stars,
            count,
            percentage: (count / totalReviews) * 100,  // Calculate the percentage of each star rating
        }));
    }


    function calculateAverageRating(reviews) {
        // Calculate the sum of the star ratings of the reviews
        const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);

        // Calculate the average rating by dividing the total stars by the number of reviews
        const averageRating = totalStars / reviews.length;

        // Return the average rating rounded to 2 decimal places
        return Math.round(averageRating * 100) / 100;
    }


    return (
        <div className="service-and-reviews-container">
        <div className="service-card">
            <div key={service.id} className="master-card">
                <div className="photos">
                    <PhotoList photos={service.photos}/>
                </div>
                <div className="master-info">
                    <h4 onClick={() => handleMasterNameClickClick(service.executorId)}>{service.name}</h4>
                    <h4>{service.rating} <FontAwesomeIcon icon={faStar} className = 'item-icon'/></h4>
                </div>
                <div className="service-description">
                    <p>{service.description}</p>
                    <p><FontAwesomeIcon icon={faHouse} className = 'item-icon'/>{service.address}</p>
                    <p>Available Slots: {service.availableSlots}</p>
                </div>
                <div className="master-info">
                    <h4><FontAwesomeIcon icon={faClock} className = 'item-icon'/> {service.duration}</h4>
                    <h4>{service.price} Byn</h4>
                </div>
                <div>
                    <button className="order-button" onClick={()=>handleOrderClick(service.id)}>
                        <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} />    Записаться</p>
                    </button>
                </div>
            </div>
        </div>
            {/*<div className="reviews-background">
                <div className="reviews-panel">
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div>
                                    <span className="user-name">{review.userName}</span>
                                    <span className="review-date">{new Date(review.createDate).toLocaleDateString()}</span>
                                </div>
                                <span className="stars">{`${review.stars} ⭐`}</span>
                            </div>
                            <p className="review-text">{review.text}</p>
                        </div>
                    ))}
                </div>
            </div>*/}
            <div className="reviews-summary">
                <h4>Overall Rating</h4>
                <p>⭐⭐⭐⭐⭐   {calculateAverageRating(reviews)} / 5</p>
                <ul>
                    {calculateStarCounts(reviews).map((item, index) => (
                        <li key={index}>
                            <span>{item.stars} stars</span>
                            <ProgressBar now={item.percentage} label={`${item.count}`} />
                        </li>
                    ))}
                </ul>
            </div>
                </div>
    );
};

export default Reviews;
