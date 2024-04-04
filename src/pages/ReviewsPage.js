import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ServiceCard.css';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reviews from "../components/Reviews";
import Cookies from "js-cookie";

const ReviewsPage = () => {
    const [service, setService] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === null

    useEffect(() => {
        const token = Cookies.get('token');
        if(!token)
            navigate("/login");
        else {
            console.log(id);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const fetchData = async () => {
                    try {
                        const response = await axios.get(`http://localhost:5155/executor-service/get-by-id/${id}`);
                        const formattedData = {
                            id: response.data.id,
                            name: response.data.executorName || 'Unknown Master',
                            serviceTypeId: response.data.serviceTypeId,
                            serviceTypeName: response.data.serviceTypeName,
                            executorId: response.data.executorId,
                            executorName: response.data.executorName,
                            description: response.data.description,
                            rating: response.data.rating,
                            price: response.data.price,
                            availableSlots: response.data.availableSlots,
                            duration: response.data.duration,
                            address: response.data.address,
                            //imageURLs: response.data.imageURLs.map((url, index) => ({ id: index + 1, url })),
                            photos: service.photos.length > 0 ? service.photos.map(photo => ({
                                id: photo.id,
                                url: photo.url,
                            })) : [{
                                id: 'default',
                                url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
                            }],
                        };
                        setService(formattedData);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };
            fetchData();
        }
    }, [id, navigate]);

    return (
        <div>
{/*            <Header />*/}
            {service && <Reviews service={service}/>}
{/*            <Footer />*/}
        </div>
    );
};

export default ReviewsPage;