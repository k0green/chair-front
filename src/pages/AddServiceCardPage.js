import React, {useContext, useEffect, useState} from 'react';
import '../styles/ServiceCard.css';
import { useParams } from "react-router-dom";
import EditServiceCard from "../components/EditServiceCard";
import {ThemeContext} from "../components/ThemeContext";
import {getAllServiceTypes} from "../components/api";
import LoadingSpinner from "../components/LoadingSpinner";
import AllCategories from "../components/AllCategories";

const AddServiceCardPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    let { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const newData = await getAllServiceTypes();
            if (newData) {
                setCategories(newData);
                setIsEmpty(!newData);
                setIsLoading(false);
            } else {
                setCategories(null);
                setIsEmpty(true);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isEmpty) {
        return (
            <div className={`empty-state ${theme === 'dark' ? 'dark' : ''}`}>
                <p>Данные не найдены</p> // Сообщение о пустом списке
            </div>
        );
    }

    const service =
        {
            id: 1,
            name: 'Service 1',
            //duration: '0001-01-01T01:00:00',
            serviceTypeId: "36dc8d14-c955-4d33-9b2b-cf2ea432da3c",
            place: {
                address: "",
                position: {
                    lat: "",
                    lng: "",
                }
            },
            photos:  [{
                id: 'default',
                url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn',
            }],
        };

    return (
        <EditServiceCard service={service} isNew={true} id={id} categories={categories}/>
        /*<AllCategories categories={categories} isEditServiceCard = {true} userId = {id}/>*/
    );
};

export default AddServiceCardPage;
