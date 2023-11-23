import React, {useContext, useEffect, useState} from "react";
import { ThemeContext } from "../context/ThemeContext";
import Footer from '../components/Footer';
import Header from '../components/Header';
import "../styles/Main.css";
import Icon from '../components/Categories';
import ServiceList from '../components/ServiceList';
import axios from "axios";

const HomePage = ({ user, onLogout }) => {
    const { theme } = useContext(ThemeContext);
    //const { theme } = true;

    const [categories, setCategories] = useState([]);  // Используем состояние для хранения данных категорий
    const [servicesData, setServicesData] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [sortOptions, setSortOptions] = useState({
        executorName: null,
        price: null,
        availableSlots: null,
        rating: null,
        duration: null,
    });
    const [optimizeServiceModal, setOptimizeServiceModal] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [freeSlots, setFreeSlots] = useState(true);
    const [priceSwitch, setPriceSwitch] = useState(true);
    const [ratingSwitch, setRatingSwitch] = useState(true);
    const [durationSwitch, setDurationSwitch] = useState(true);

    const handleOPRClick = () => {
        setOptimizeServiceModal(true);
    };

    const handleServiceTypeChange = (event) => {
        setSelectedServiceType(event.target.value);
    };

    const handleSwitchChange = (field) => {
        switch (field) {
            case 'freeSlots':
                setFreeSlots(!freeSlots);
                break;
            case 'price':
                setPriceSwitch(!priceSwitch);
                break;
            case 'rating':
                setRatingSwitch(!ratingSwitch);
                break;
            case 'duration':
                setDurationSwitch(!durationSwitch);
                break;
            default:
                break;
        }
    };

    const handleOptimizeServiceClick = () => {
        // Prepare the request body
        const requestBody = {
            filterModel: {
            },
            serviceTypeId: selectedServiceType,
            conditions: [
                { column: 1, value: freeSlots, lambda: 0.2 },
                { column: 2, value: priceSwitch, lambda: 0.4 },
                { column: 3, value: ratingSwitch, lambda: 0.3 },
                { column: 4, value: durationSwitch, lambda: 0.1 },
            ],
        };

        // Make the request
        axios.post('http://localhost:5155/executor-service/optimize-service', requestBody)
            .then(response => {
                // Handle the response as needed
                console.log(response);
            })
            .catch(error => {
                console.error('Error optimizing service:', error);
            });

        // Close the modal after submitting
        setOptimizeServiceModal(true);
    };

    const handleSortClick = (field, direction) => {
        // Update the sort direction for the selected field
        setSortOptions((prevSortOptions) => {
            const newSortOptions = { ...prevSortOptions, [field]: direction };
            // Check if both arrows should be deactivated on the third click
            const clickCount = Object.values(newSortOptions).filter((value) => value !== null).length;
            if (clickCount >= 5000) {
                return {
                    executorName: null,
                    price: null,
                    availableSlots: null,
                    rating: null,
                    duration: null,
                };
            }

            return newSortOptions;
        });
    };

    const handleCancelSortClick = (field, value) => {
        setSortOptions((prevSortOptions) => {
            if (field === "executorName")
                return {
                    ...prevSortOptions,
                    masterName: null,
                };
            else if (field === "price")
                return {
                    ...prevSortOptions,
                    price: null,
                };
            else if (field === "availableSlots")
                return {
                    ...prevSortOptions,
                    availableSlots: null,
                };
            else if (field === "rating")
                return {
                    ...prevSortOptions,
                    rating: null,
                };
            else if (field === "duration")
                return {
                    ...prevSortOptions,
                    duration: null,
                };
        });
    };


    useEffect(() => {
        // Выполнение запроса при монтировании компонента
        axios.get('http://localhost:5155/service-types/get-all', {
        })
            .then(response => {
                setCategories(response.data);  // Обновление состояния с данными с сервера
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }, []);

    useEffect(() => {
        axios.post('http://localhost:5155/executor-service/all', {
            skip: 0,
            take: 10,
        })
            .then(response => {
                // Преобразование данных с сервера в необходимый формат
                const newServicesData = response.data.map(serviceType => ({
                    id: serviceType.id,
                    name: serviceType.serviceTypeName,
                    masters: serviceType.services.map(service => ({
                        id: service.id,
                        name: service.executorName,
                        description: service.description,
                        price: service.price,
                        availableSlots: service.availableSlots,
                        duration: formatTime(service.duration),
                        rating: service.rating,
                        address: service.address,
                        executorId: service.executorId,
                        //photos: service.imageURLs.map((url, index) => ({ id: index + 1, url })),
                        photos: [{ id: 1, url: 'path/to/photo1.jpg' }, { id: 2, url: 'path/to/photo2.jpg' }],
                    })),
                }));

                // Обновление состояния с новыми данными
                setServicesData(newServicesData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }, []);

    const formatTime = (rawTime) => {
        const date = new Date(rawTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleFilterClick = () => {
        setShowFilterModal(true);
    };

    const handleModalClose = () => {
        setShowFilterModal(false);
    };



    const handleFilterApply = () => {
            const masterNameValue = document.getElementById("masterName").value;
            const priceFromValue = document.getElementById("priceFrom").value;
            const priceToValue = document.getElementById("priceTo").value;
            const ratingFromValue = document.getElementById("ratingFrom").value;
            const ratingToValue = document.getElementById("ratingTo").value;
            const durationValue = document.getElementById("duration").value;

            const filters = [];

            if (masterNameValue) {
                const nameFilter = {
                    logic: "and",
                    filters: [],
                };

                    nameFilter.filters.push({
                        field: "executorName",
                        value: masterNameValue,
                        operator: "contains",
                    });

                filters.push(nameFilter);
            }

            if (priceFromValue || priceToValue) {
                const priceFilter = {
                    logic: "and",
                    filters: [],
                };

                if (priceFromValue) {
                    priceFilter.filters.push({
                        field: "price",
                        value: priceFromValue,
                        operator: ">=",
                    });
                }

                if (priceToValue) {
                    priceFilter.filters.push({
                        field: "price",
                        value: priceToValue,
                        operator: "<=",
                    });
                }

                filters.push(priceFilter);
            }

            if (ratingFromValue || ratingToValue) {
                const ratingFilter = {
                    logic: "and",
                    filters: [],
                };

                if (ratingFromValue) {
                    ratingFilter.filters.push({
                        field: "rating",
                        value: ratingFromValue,
                        operator: ">=",
                    });
                }

                if (ratingToValue) {
                    ratingFilter.filters.push({
                        field: "rating",
                        value: ratingToValue,
                        operator: "<=",
                    });
                }

                filters.push(ratingFilter);
            }

            if (durationValue) {
                filters.push({
                    field: "duration",
                    value: durationValue,
                    operator: "contains",
                });
            }

            const filter = filters.length > 1 ? { logic: "and", filters } : filters[0];

            // Rest of your code remains the same

            const sort = Object.entries(sortOptions)
                .filter(([key, value]) => value !== null)
                .map(([key, value]) => ({
                    field: key,
                    direction: value,
                }));

            const requestBody = {
                skip: 0,
                take: 10,
                sort,
                filter,
            };

            axios.post('http://localhost:5155/executor-service/all', requestBody)
                .then(response => {
                    // Преобразование данных с сервера в необходимый формат
                    const newServicesData = response.data.map(serviceType => ({
                        id: serviceType.id,
                        name: serviceType.serviceTypeName,
                        masters: serviceType.services.map(service => ({
                            id: service.id,
                            name: service.executorName,
                            description: service.description,
                            price: service.price,
                            availableSlots: service.availableSlots,
                            duration: formatTime(service.duration),
                            rating: service.rating,
                            address: service.address,
                            executorId: service.executorId,
                            //photos: service.imageURLs.map((url, index) => ({ id: index + 1, url })),
                            photos: [{ id: 1, url: 'path/to/photo1.jpg' }, { id: 2, url: 'path/to/photo2.jpg' }],
                        })),
                    }));

                    // Обновление состояния с новыми данными
                    setServicesData(newServicesData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

        // Close the filter modal after applying filters
        setShowFilterModal(false);
    };

    const renderToggle = (field, checked, onChange) => (
        <div className="toggle-container">
            <span className="toggle-label">{field}</span>
            <label>Min</label>
            <label className="toggle-switch">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <span className="toggle-slider"></span>
            </label>
            <label>Max</label>
        </div>
    );

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <Header user={user} onLogout={onLogout} />
            <div>
                <Icon categories={categories}/>
            </div>
            <div>
                <button className="filter-button" onClick={handleOPRClick}>
                    Найти наилучший вариант
                </button>
                <button className="filter-button" onClick={handleFilterClick}>
                    Filter
                </button>
                <ServiceList services={servicesData} />
            </div>
            {showFilterModal && (
                <div className="filter-modal">
                    <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
                        <h2>Filter</h2>
                        <div>
                            <label htmlFor="masterName">Master Name:</label>
                            <input style={{width: '45%'}} type="text" className="custom-input" id="masterName" placeholder="Enter master name" />
                        </div>
                        <div>
                            <label htmlFor="priceFrom">Price Range:</label>
                            <input style={{width: '15%'}} type="number" id="priceFrom" placeholder="From" />
                            <label> - </label>
                            <input style={{width: '15%'}} type="number" id="priceTo" placeholder="To" />
                        </div>
                        <div>
                            <label htmlFor="rating">Rating:</label>
                            <input
                                type="number"
                                id="ratingFrom"
                                min="0"
                                max="5"
                                style={{width: '10%'}}
                            />
                            <label> - </label>
                            <input
                                type="number"
                                id="ratingTo"
                                min="0"
                                max="5"
                                className="custom-input"
                                style={{width: '10%'}}
                            />
                        </div>
                            <div>
                                <label htmlFor="duration">Duration:</label>
                                <input style={{width: '15%'}}type="time" id="duration" placeholder="Enter duration" />
                            </div>
                        <h3>Sort By:</h3>
                        <div>
                            <label>Name:</label>
                            <div className="sort-arrows">
                        <span
                            className={`arrow ${sortOptions.executorName === 'asc' ? 'active' : ''}`}
                            onClick={() => handleSortClick('executorName', 'asc')}
                        >
                            &#8593;
                        </span>
                                <span
                                    className={`arrow ${sortOptions.executorName === 'desc' ? 'active' : ''}`}
                                    onClick={() => handleSortClick('executorName', 'desc')}
                                >
                            &#8595;
                        </span>
                                <span
                                    onClick={() => handleCancelSortClick('executorName')}
                                >
                            &#215;
                        </span>
                            </div>
                        </div>
                        <div>

                            <label>Price:</label>
                            <div className="sort-arrows">
                        <span
                            className={`arrow ${sortOptions.price === 'asc' ? 'active' : ''}`}
                            onClick={() => handleSortClick('price', 'asc')}
                        >
                            &#8593;
                        </span>
                                <span
                                    className={`arrow ${sortOptions.price === 'desc' ? 'active' : ''}`}
                                    onClick={() => handleSortClick('price', 'desc')}
                                >
                            &#8595;
                        </span>
                                <span
                                    onClick={() => handleCancelSortClick('price')}
                                >
                            &#215;
                        </span>
                            </div>
                        </div>
                        <div>

                            <label>Available Slots:</label>
                            <div className="sort-arrows">
                        <span
                            className={`arrow ${sortOptions.availableSlots === 'asc' ? 'active' : ''}`}
                            onClick={() => handleSortClick('availableSlots', 'asc')}
                        >
                            &#8593;
                        </span>
                                <span
                                    className={`arrow ${sortOptions.availableSlots === 'desc' ? 'active' : ''}`}
                                    onClick={() => handleSortClick('availableSlots', 'desc')}
                                >
                            &#8595;
                        </span>
                                <span
                                    onClick={() => handleCancelSortClick('availableSlots')}
                                >
                            &#215;
                        </span>
                            </div>
                        </div>
                        <div>
                            <label>Rating:</label>
                            <div className="sort-arrows">
                        <span
                            className={`arrow ${sortOptions.rating === 'asc' ? 'active' : ''}`}
                            onClick={() => handleSortClick('rating', 'asc')}
                        >
                            &#8593;
                        </span>
                                <span
                                    className={`arrow ${sortOptions.rating === 'desc' ? 'active' : ''}`}
                                    onClick={() => handleSortClick('rating', 'desc')}
                                >
                            &#8595;
                        </span>
                                <span
                                    onClick={() => handleCancelSortClick('rating')}
                                >
                            &#215;
                        </span>
                            </div>
                        </div>
                        <div>
                            <label>Duration:</label>
                            <div className="sort-arrows">
                        <span
                            className={`arrow ${sortOptions.duration === 'asc' ? 'active' : ''}`}
                            onClick={() => handleSortClick('duration', 'asc')}
                        >
                            &#8593;
                        </span>
                                <span
                                    className={`arrow ${sortOptions.duration === 'desc' ? 'active' : ''}`}
                                    onClick={() => handleSortClick('duration', 'desc')}
                                >
                            &#8595;
                        </span>
                                <span
                                    onClick={() => handleCancelSortClick('duration')}
                                >
                            &#215;
                        </span>
                            </div>
                        </div>
                            <button onClick={handleFilterApply}>Apply Filters</button>
                        </div>
                </div>
            )}
            {optimizeServiceModal && (
                <div className="filter-modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setOptimizeServiceModal(false)}>
                            &times;
                        </span>
                        <h2>Optimize Service</h2>
                        <div>
                            <label htmlFor="serviceType">Service Type:</label>
                            <select id="serviceType" onChange={handleServiceTypeChange} value={selectedServiceType}>
                                {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            {renderToggle('Free Slots', freeSlots, () => handleSwitchChange('freeSlots'))}
                        </div>
                        <div>
                            {renderToggle('Price', priceSwitch, () => handleSwitchChange('price'))}
                        </div>
                        <div>
                            {renderToggle('Rating', ratingSwitch, () => handleSwitchChange('rating'))}
                        </div>
                        <div>
                            {renderToggle('Duration', durationSwitch, () => handleSwitchChange('duration'))}
                        </div>
                        <button onClick={handleOptimizeServiceClick}>Optimize Service</button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default HomePage;