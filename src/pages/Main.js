import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../components/ThemeContext";
import "../styles/Main.css";
import Icon from '../components/Categories';
import ServiceList from '../components/ServiceList';
import {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {toast} from "react-toastify";
import ru from "date-fns/locale/ru";
import en from "date-fns/locale/en-US";
import {getAllServiceTypes} from "../components/api";
import LoadingSpinner from "../components/LoadingSpinner";
import allCategories from "../components/AllCategories";
import {useNavigate} from "react-router-dom";
import {LanguageContext} from "../components/LanguageContext";

const HomePage = ({user, onLogout}) => {
    const {theme} = useContext(ThemeContext);
    const [categories, setCategories] = useState([]);
    const [filterData, setFilter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    registerLocale("ru", ru);
    registerLocale("en", en);
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);

    const allCategoriesClick = () => {
        navigate('/all-categories');
    };

    useEffect(() => {
        const fetchData = async () => {
                const response = await getAllServiceTypes();
                setCategories(response);
                setIsLoading(false);
                setIsEmpty(response.length === 0);
        };
        fetchData();

        const requestBody = {
            skip: 0,
            take: 10,
        };

        setFilter(requestBody);
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isEmpty) {
        return (
            <div className={`empty-state ${theme === 'dark' ? 'dark' : ''}`}>
                <p>Нет сообщений</p>
            </div>
        );
    }

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div style={{display: "flex", justifyContent: "right", width: "95%"}}>
                <h4 onClick={allCategoriesClick} style={{color: "#007bff"}}>
                    {translations[language]['AllCategories']}
                </h4>
            </div>
            <div>
                <Icon categories={categories}/>
            </div>
            <div>
                <ServiceList
                    filter={filterData}
                    itemPerPage={Math.max(2, Math.floor(window.innerWidth / 400))}
                />
            </div>
        </div>
    );
};

export default HomePage;