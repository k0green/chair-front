import React from 'react';
import ServiceCard from './ServiceCard';

const ServiceList = ({ services, isProfile }) => {
    return (
        <div className="service-list">
            {services.map((service) => (
                <div>
                    <h1 className="service-name-left">{service.name}</h1>
                    <ServiceCard key={service.id} service={service} isProfile={isProfile}/>
                </div>
            ))}
        </div>
    );
};

export default ServiceList;
