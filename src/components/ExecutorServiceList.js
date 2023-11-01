import React from 'react';
import ExecutorServiceCard from "./ExecutorServiceCard";

const ExecutorServiceList = ({ servicesData }) => {
    return (
        <div className="service-list">
            {servicesData.map((service) => (
                <ExecutorServiceCard key={service.id} service={service} />
            ))}
        </div>
    );
};

export default ExecutorServiceList;
