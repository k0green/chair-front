import React, { useEffect, useState } from 'react';
import ServiceCardTypeList from './ServiceCardTypeList';
import "../styles/ServiceCard.css";
import { toast } from "react-toastify";
import { getPopularServiceTypes } from './api';
import 'react-datepicker/dist/react-datepicker.css';

const ServiceList = ({filter}) => {
    const [popularTypesData, setPopularTypesData] = useState([]);

    useEffect(() => {
        getPopularServiceTypes({
            skip: 0,
            take: 5,
        }).then(newData => {
                setPopularTypesData(newData);
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

    return (
        <div>
            {popularTypesData != null && popularTypesData.length > 0 ? (
                popularTypesData.map((type) => {
                    return (
                        <div key={type.id}>
                            <ServiceCardTypeList id={type.id} name={type.name} filter={filter} />
                        </div>
                    );
                })
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ServiceList;
