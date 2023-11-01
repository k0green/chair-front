import React from 'react';
import ServiceCard from './ServiceCard';

const ServiceList = ({ services }) => {
    return (
        <div className="service-list">
            {services.map((service) => (
                <div>
                    <h1 className="service-name-left">{service.name}</h1>
                    <ServiceCard key={service.id} service={service} />
                </div>
            ))}
        </div>
    );
};

export default ServiceList;
