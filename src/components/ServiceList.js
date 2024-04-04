import React, {useContext} from 'react';
import ServiceCard from './ServiceCard';
import "../styles/ServiceCard.css";
import {ThemeContext} from "./ThemeContext";

const ServiceList = ({ services, isProfile }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div>
            {services.map((service) => (
                <div className='card-list'>
                    <h1 className={`service-name-left ${theme === 'dark' ? 'dark' : ''}`}>{service.name}</h1>
                    <ServiceCard service={service} isProfile={isProfile} />
                </div>
            ))}
        </div>
    );
};


export default ServiceList;
