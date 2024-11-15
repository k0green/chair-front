import React, {useContext} from 'react';
import ServiceCardTypeList from '../pages/ErrorPage';
import "../styles/ServiceCard.css";
import 'react-datepicker/dist/react-datepicker.css';
import {LanguageContext} from "./LanguageContext";

const ServiceList = ({filter, itemPerPage}) => {

    const { language, translations } = useContext(LanguageContext);

    return (
        <div style={{ position: 'relative' }}>
            <div>
                <ServiceCardTypeList name={translations[language]['Popular']} filter={filter} itemPerPage={itemPerPage}/>
            </div>
        </div>
    );
};

export default ServiceList;
