import React, {useContext, useEffect, useState} from 'react';
import ServiceCardTypeList from '../pages/ErrorPage';
import "../styles/ServiceCard.css";
import { toast } from "react-toastify";
import { getPopularServiceTypes } from './api';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingSpinner from "./LoadingSpinner";
import {ThemeContext} from "./ThemeContext";

const ServiceList = ({filter, itemPerPage}) => {
/*    const [popularTypesData, setPopularTypesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);*/
    /*const {theme} = useContext(ThemeContext);*/

/*    useEffect(() => {
        const fetchData = async () => {
                const response = await getPopularServiceTypes({
                    skip: 0,
                    take: 5,
                });
                setPopularTypesData(response);
                setIsLoading(false);
                setIsEmpty(response.length === 0);
        };
        fetchData();
    }, []);*/

    return (
        <div style={{ position: 'relative' }}>
            <div>
                <ServiceCardTypeList name={"Популярные"} filter={filter} itemPerPage={itemPerPage}/>
            </div>
        </div>
    );
};

export default ServiceList;
