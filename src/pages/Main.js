import React, {useContext, useEffect, useState} from "react";
import { ThemeContext } from "../components/ThemeContext";
import "../styles/Main.css";
import Icon from '../components/Categories';
import ServiceList from '../components/ServiceList';
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {isSameDay} from "date-fns";
import PhotoList from "../components/PhotoList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoltLightning, faClock, faHouse, faPencil, faStar, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

const HomePage = ({ user, onLogout }) => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    //const { theme } = true;

    const [categories, setCategories] = useState([]);  // Используем состояние для хранения данных категорий
    const [servicesData, setServicesData] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [showOprResModal, setShowOprResModal] = useState(false);
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
    const [selectedDates, setSelectedDates] = useState([]);
    const [timeRanges, setTimeRanges] = useState([]);
    const [masterNameValue, setMasterNameValue] = useState('');
    const [priceFromValue, setPriceFromValue] = useState('');
    const [priceToValue, setPriceToValue] = useState('');
    const [ratingFromValue, setRatingFromValue] = useState('');
    const [ratingToValue, setRatingToValue] = useState('');
    const [durationFromValue, setDurationFromValue] = useState('');
    const [durationToValue, setDurationToValue] = useState('');
// Add state variables for sort arrows
    const [executorNameSort, setExecutorNameSort] = useState(null);
    const [priceSort, setPriceSort] = useState(null);
    const [availableSlotsSort, setAvailableSlotsSort] = useState(null);
    const [ratingSort, setRatingSort] = useState(null);
    const [durationSort, setDurationSort] = useState(null);
    const [oprData, setOprData] = useState(null);


    const isDateSelected = (date) => {
        // Проверяем, выбран ли день
        return selectedDates.some((selectedDate) =>
            isSameDay(selectedDate, date)
        );
    };

    const handleDateChange = (date) => {
        // Convert the selected date to UTC to avoid time zone issues
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

        // If the day is already selected, remove it; otherwise, add it to the list
        if (isDateSelected(utcDate)) {
            const updatedDates = selectedDates.filter(
                (selectedDate) => !isSameDay(selectedDate, utcDate)
            );
            setSelectedDates(updatedDates);
        } else {
            setSelectedDates([...selectedDates, utcDate]);
        }
    };

    const handleTimeChange = (index, field, value) => {
        setTimeRanges((prevRanges) => {
            const newRanges = [...prevRanges];
            newRanges[index][field] = value;
            return newRanges;
        });
    };


    const handleAddTimeRange = () => {
        setTimeRanges((prevRanges) => [...prevRanges, { startTime: null, endTime: null }]);
    };


    const handleRemoveTimeRange = (index) => {
        setTimeRanges((prevRanges) => {
            const newRanges = [...prevRanges];
            newRanges.splice(index, 1);
            return newRanges;
        });
    };

    const handlePeriodClick = () => {
        setShowPeriodModal(true);
    };

    const handlePeriodClose = () => {
        setShowPeriodModal(false);
    };

    const handleResetFilters = () => {
        setSelectedDates([]);
        setTimeRanges([{ startTime: null, endTime: null }]);
    };

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
                { column: 1, value: freeSlots, lambda: 0.4 },
                { column: 2, value: priceSwitch, lambda: 0.2 },
                { column: 3, value: ratingSwitch, lambda: 0.3 },
                { column: 4, value: durationSwitch, lambda: 0.1 },
            ],
        };

        // Make the request
        axios.post('http://localhost:5155/executor-service/optimize-service', requestBody)
            .then(response => {
                const newServicesData = {
                        id: response.data.id,
                        name: response.data.executorName,
                        description: response.data.description,
                        price: response.data.price,
                        availableSlots: response.data.availableSlots,
                        duration: formatTime(response.data.duration),
                        rating: response.data.rating,
                        address: response.data.address,
                        executorId: response.data.executorId,
                    photos: response.data.photos.length > 0 ? response.data.photos.map(photo => ({
                        id: photo.id,
                        url: photo.url,
                    })) : [{
                        id: 'default',
                        url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
                    }],
                };

                setOprData(newServicesData);
            })
            .catch(error => {
                console.error('Error optimizing service:', error);
            });


/*        setTimeout(() => {
            setOptimizeServiceModal(true);
            setShowOprResModal(true);
        }, 300000);*/
        setOptimizeServiceModal(true);
        if(oprData)
            setShowOprResModal(true);
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
            filter: {
                skip: 0,
                take: 10,
            }
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
                        photos: service.photos.length > 0 ? service.photos.map(photo => ({
                            id: photo.id,
                            url: photo.url,
                        })) : [{
                            id: 'default',
                            url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
                        }],
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
        const masterNameElement = document.getElementById("masterName");
        const priceFromElement = document.getElementById("priceFrom");
        const priceToElement = document.getElementById("priceTo");
        const ratingFromElement = document.getElementById("ratingFrom");
        const ratingToElement = document.getElementById("ratingTo");
        const durationFromElement = document.getElementById("durationFrom");
        const durationToElement = document.getElementById("durationTo");

        const masterNameValue = masterNameElement ? masterNameElement.value : null;
        const priceFromValue = priceFromElement ? priceFromElement.value : null;
        const priceToValue = priceToElement ? priceToElement.value : null;
        const ratingFromValue = ratingFromElement ? ratingFromElement.value : null;
        const ratingToValue = ratingToElement ? ratingToElement.value : null;
        const durationFromValue = durationFromElement ? durationFromElement.value : null;
        const durationToValue = durationToElement ? durationToElement.value : null;

        setMasterNameValue(masterNameElement ? masterNameElement.value : null);
        setPriceFromValue(priceFromElement ? priceFromElement.value : null);
        setPriceToValue(priceToElement ? priceToElement.value : null);
        setRatingFromValue(ratingFromElement ? ratingFromElement.value : null);
        setRatingToValue(ratingToElement ? ratingToElement.value : null);
        setDurationFromValue(durationFromElement ? durationFromElement.value : null);
        setDurationToValue(durationToElement ? durationToElement.value : null);

        setExecutorNameSort(sortOptions.executorName);
        setPriceSort(sortOptions.price);
        setAvailableSlotsSort(sortOptions.availableSlots);
        setRatingSort(sortOptions.rating);
        setDurationSort(sortOptions.duration);

            const filters = [];

            if (masterNameValue) {
                const nameFilter = {
                    logic: "and",
                    filters: [],
                };

                    nameFilter.filters.push({
                        field: "executorName",
                        value: '"'+masterNameValue+'"',
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

/*            if (durationFromValue) {
                filters.push({
                    field: "duration",
                    value: durationValue,
                    operator: "contains",
                });
            }*/

        if (durationFromValue || durationToValue) {
            const durationFilter = {
                logic: "and",
                filters: [],
            };

            if (durationFromValue) {
                durationFilter.filters.push({
                    field: "duration",
                    value: new Date(`2023-11-02T${durationFromValue}:00.000Z`).toISOString(),
                    operator: ">=",
                });
            }

            if (durationToValue) {
                durationFilter.filters.push({
                    field: "duration",
                    value: new Date(`2023-11-02T${durationToValue}:00.000Z`).toISOString(),
                    operator: "<=",
                });
            }

            filters.push(durationFilter);
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
                filter: {
                    skip: 0,
                    take: 10,
                    sort,
                    filter,
                },
                dates: selectedDates,
                times: timeRanges.map((timeRange) => ({
                    startTime: timeRange.startTime ? new Date(`2023-11-02T${timeRange.startTime}:00.000Z`).toISOString() : null,
                    endTime: timeRange.endTime ? new Date(`2023-11-02T${timeRange.endTime}:00.000Z`).toISOString() : null,
                })),
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
                            photos: service.photos.length > 0 ? service.photos.map(photo => ({
                                id: photo.id,
                                url: photo.url,
                            })) : [{
                                id: 'default',
                                url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
                            }],
                            /*photos: [{ id: service.photos.id, url: 'https://www.desktopbackground.org/download/o/2014/07/09/790888_chrome-set-as-wallpapers-wallpapers-zone_7539x5031_h.jpg' }, { id: 2, url: 'path/to/photo2.jpg' },
                                { id: 3, url: 'http://priroda.club/uploads/posts/2022-07/1658478016_13-priroda-club-p-krasivie-prirodnie-peizazhi-priroda-krasiv-13.jpg' }, { id: 4, url: 'path/to/photo4.jpg' },
                                { id: 5, url: 'https://gas-kvas.com/uploads/posts/2023-02/1675444651_gas-kvas-com-p-fonovii-risunok-rabochego-priroda-10.jpg' }, { id: 6, url: 'path/to/photo6.jpg' }],*/
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
        setShowPeriodModal(false);
    };

    const handleFilterClear = () => {

        setMasterNameValue(null);
        setPriceFromValue(null);
        setPriceToValue(null);
        setRatingFromValue(null);
        setRatingToValue(null);
        setDurationFromValue(null);
        setDurationToValue( null);

        setExecutorNameSort(null);
        setPriceSort(null);
        setAvailableSlotsSort(null);
        setRatingSort(null);
        setDurationSort(null);
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

    const handleOrderClick = (executorServiceId) => {
        navigate("/calendar/"+ executorServiceId);
    };

    let handleMasterNameClickClick = (masterId) => {
        navigate("/profile/" + masterId);
    };

    return (
        <div className={theme === "dark" ? "main-dark-theme" : "main-light-theme"}>
            <div>
                <Icon categories={categories}/>
            </div>
            <div>
                <div className="parent-container">
                    <button className="filter-button" onClick={handleOPRClick}>
                        Найти наилучший вариант
                    </button>
                    <button className="filter-button" onClick={handlePeriodClick}>
                        Подбор по датам
                    </button>
                    <button className="filter-button" onClick={handleFilterClick}>
                        Filter
                    </button>
                </div>
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
                            <input defaultValue={masterNameValue} style={{width: '45%'}} type="text" className="custom-input" id="masterName" placeholder="Enter master name" />
                        </div>
                        <div>
                            <label htmlFor="priceFrom">Price Range:</label>
                            <input defaultValue={priceFromValue} style={{width: '15%'}} type="number" id="priceFrom" placeholder="From" />
                            <label> - </label>
                            <input defaultValue={priceToValue} style={{width: '15%'}} type="number" id="priceTo" placeholder="To" />
                        </div>
                        <div>
                            <label htmlFor="rating">Rating:</label>
                            <input
                                defaultValue={ratingFromValue}
                                type="number"
                                id="ratingFrom"
                                min="0"
                                max="5"
                                style={{width: '10%'}}
                            />
                            <label> - </label>
                            <input
                                defaultValue={ratingToValue}
                                type="number"
                                id="ratingTo"
                                min="0"
                                max="5"
                                className="custom-input"
                                style={{width: '10%'}}
                            />
                        </div>
                            <div>
                                <label htmlFor="durationFrom">Duration:</label>
                                <input defaultValue={durationFromValue} style={{width: '15%'}} type="time" id="durationFrom" placeholder="Enter duration" />
                        <label>-</label>
                                <input defaultValue={durationToValue} style={{width: '15%'}} type="time" id="durationTo" placeholder="Enter duration" />
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
                            <button onClick={handleFilterClear}>Clear</button>
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
            {showOprResModal && (
                <div className="filter-modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowOprResModal(false)}>
                            &times;
                        </span>
                        <div style={{display: "flex", justifyContent: "center"}}>
                        <div className="service-card">
                            <div key={oprData.id} className="master-card">
                                <div className="photos">
                                    <PhotoList photos={oprData.photos}/>
                                </div>
                                <div className="master-info">
                                    <h4 onClick={() => handleMasterNameClickClick(oprData.executorId)}>{oprData.name}</h4>
                                    <h4>{oprData.rating} <FontAwesomeIcon icon={faStar} className = 'item-icon'/></h4>
                                </div>
                                <div className="service-description">
                                    <p>{oprData.description}</p>
                                    <p><FontAwesomeIcon icon={faHouse} className = 'item-icon'/>{oprData.address}</p>
                                    <p>Available Slots: {oprData.availableSlots}</p>
                                </div>
                                <div className="master-info">
                                    <h4><FontAwesomeIcon icon={faClock} className = 'item-icon'/> {oprData.duration}</h4>
                                    <h4>{oprData.price} Byn</h4>
                                </div>
                                <div>
                                        <button className="order-button" onClick={()=>handleOrderClick(oprData.id)}>
                                            <p className="order-text"><FontAwesomeIcon icon={faBoltLightning} />    Записаться</p>
                                        </button>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}
            {showPeriodModal && (
                <div className="filter-modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowPeriodModal(false)}>
                            &times;
                        </span>
                        <div>
                            <DatePicker
                                selected={null} // Установите выбранную дату в null, чтобы позволить выбирать дни
                                onChange={handleDateChange}
                                inline // Рендер календаря всегда видимым
                                dayClassName={(date) => (isDateSelected(date) ? 'selected' : '')} // Добавляем класс к выделенным дням
                            />
                        </div>
                        {timeRanges.map((timeRange, index) => (
                            <div key={index}>
                                <label>Time Range {index + 1}:</label>
                                <input
                                    type="time"
                                    style={{width: '15%'}}
                                    value={timeRange.startTime || ''}
                                    onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                                />
                                <span> - </span>
                                <input
                                    type="time"
                                    style={{width: '15%'}}
                                    value={timeRange.endTime || ''}
                                    onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                                />
                                {index > -1 && (
                                    <button onClick={() => handleRemoveTimeRange(index)}>
                                        Remove Time Range
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={handleAddTimeRange}>Add Time Range</button>
                        <button onClick={handleResetFilters}>Reset Filters</button>
                        <button onClick={handleFilterApply}>Apply Filters</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;