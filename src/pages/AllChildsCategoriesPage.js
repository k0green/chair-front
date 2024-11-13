import React, {useContext, useEffect, useState} from "react";
import { ThemeContext } from "../components/ThemeContext";
import "../styles/Main.css";
import {useParams} from "react-router-dom";
import ServiceCardTypeList from "./ErrorPage";
import {getAllServiceTypes, getServiceTypeById} from '../components/api';
import {toast} from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import AllChildrenCategory from "../components/AllChildrenCategory";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconComponent from "../components/IconComponent";

const AllChildsCategoriesPage = () => {
    const { theme } = useContext(ThemeContext);
    let { id } = useParams();
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [types, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        setIsEmpty(true);
        setIsLoading(true);
        const newData = await getAllServiceTypes(id);
        if (newData) {
            setCategories(newData);
            setIsEmpty(!newData);
            setIsLoading(false);
        } else {
            setCategories(null);
            setIsEmpty(true);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isEmpty) {
        return (
            <div className={`empty-state ${theme === 'dark' ? 'dark' : ''}`}>
                <p>Данные не найдены</p>
            </div>
        );
    }

    return (
        <div className="all-category-type-container">
            <AllChildrenCategory categories={types} isEditServiceCard={false} />
        </div>
    );
};

export default AllChildsCategoriesPage;
