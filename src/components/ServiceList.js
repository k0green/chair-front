import React from 'react';
import ServiceCard from './ServiceCard';
import "../styles/ServiceCard.css";

const ServiceList = ({ services, isProfile }) => {
    return (
        <div>
            {services.map((service) => (
                <div className='card-list'>
                    <h1 className="service-name-left">{service.name}</h1>
                    <ServiceCard service={service} isProfile={isProfile} />
                </div>
            ))}
        </div>
    );
};


export default ServiceList;
