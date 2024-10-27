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

const HomePage = ({user, onLogout}) => {
    const {theme} = useContext(ThemeContext);
    const [categories, setCategories] = useState([]);
    const [filterData, setFilter] = useState(null);
    registerLocale("ru", ru);
    registerLocale("en", en);

    useEffect(() => {
        getAllServiceTypes().then(newData => {
            setCategories(newData);
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

    }, []);

    useEffect(() => {
        const requestBody = {
                skip: 0,
                take: 10,
        };

        setFilter(requestBody);
    }, []);

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <Icon categories={categories}/>
            </div>
            <div>
                <ServiceList
                    filter={filterData}
                    itemPerPage={Math.max(1, Math.floor(window.innerWidth / 400))}
                />
            </div>
        </div>
    );
};

export default HomePage;