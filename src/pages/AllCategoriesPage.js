import React, {useContext, useEffect, useState} from "react";
import { ThemeContext } from "../components/ThemeContext";
import "../styles/Main.css";
import {useNavigate, useParams} from "react-router-dom";
import {getAllServiceTypes} from '../components/api';
import LoadingSpinner from "../components/LoadingSpinner";
import AllCategories from "../components/AllCategories";

const AllCategoriesPage = () => {
    const { theme } = useContext(ThemeContext);
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

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <AllCategories categories={categories} />
            </div>
        </div>
    );
};

export default AllCategoriesPage;
