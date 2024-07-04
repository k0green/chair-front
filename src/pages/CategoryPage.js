import React, {useContext, useEffect, useState} from "react";
import { ThemeContext } from "../components/ThemeContext";
import "../styles/Main.css";
import {useParams} from "react-router-dom";
import ServiceCardTypeList from "../components/ServiceCardTypeList";
import {getServiceTypeById} from '../components/api';
import {toast} from "react-toastify";

const HomePage = ({ user, onLogout }) => {
    const { theme } = useContext(ThemeContext);
    let { id } = useParams();
    const [typeData, setTypeData] = useState([]);

    useEffect(() => {
        getServiceTypeById(id).then(newData => {
            setTypeData(newData);
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
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <ServiceCardTypeList id={id} name={typeData.name} filter={{ skip: 0, take: 10 }} />
 {/*<ImageWithButton imageUrl="https://th.bing.com/th/id/OIG3.P9oT9D3EIP9NQhSwgVqH?w=1024&h=1024&rs=1&pid=ImgDetMain" text="К сожалению тут пусто"/>*/}
            </div>
        </div>
    );
};

export default HomePage;