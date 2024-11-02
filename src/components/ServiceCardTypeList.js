import React, { useContext, useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import "../styles/ServiceCard.css";
import { ThemeContext } from "./ThemeContext";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import MapModal from "./MapModal";
import { useNavigate } from "react-router-dom";
import {getOptimalServiceCard, getServiceCardByTypeId} from './api';
import PhotoList from "./PhotoList";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {faBoltLightning, faClock, faHouse, faStar} from "@fortawesome/free-solid-svg-icons";
import {LanguageContext} from "./LanguageContext";
import {isSameDay} from "date-fns";
import Cookies from "js-cookie";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faFilter} from "@fortawesome/free-solid-svg-icons/faFilter";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons/faArrowDown";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons/faArrowUp";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faWandSparkles} from "@fortawesome/free-solid-svg-icons/faWandSparkles";

const ServiceCardTypeList = ({ id, name, filter, itemPerPage }) => {
    const { theme } = useContext(ThemeContext);
    const [servicesData, setServicesData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemPerPage);
    const [selectedPlace, setSelectedPlace] = useState({ position: null, address: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalCount, setTotalCount] = useState(5);
    const {language, translations} = useContext(LanguageContext);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [showOprResModal, setShowOprResModal] = useState(false);
    const [optimizeServiceModal, setOptimizeServiceModal] = useState(false);
    const navigate = useNavigate();
    const [sortOptions, setSortOptions] = useState({
        executorName: null,
        price: null,
        availableSlots: null,
        rating: null,
        duration: null,
    });
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
    const [executorNameSort, setExecutorNameSort] = useState(null);
    const [priceSort, setPriceSort] = useState(null);
    const [availableSlotsSort, setAvailableSlotsSort] = useState(null);
    const [ratingSort, setRatingSort] = useState(null);
    const [durationSort, setDurationSort] = useState(null);
    const [oprData, setOprData] = useState(null);
    const [filterData, setFilter] = useState(null);
    const [sortData, setSortData] = useState(null);
    const [filterValuesData, setFilterValuesData] = useState(null);
    const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false);

    useEffect(() => {
        const updateItemsPerPage = () => {
            const maxItems = Math.max(1, Math.floor(window.innerWidth / 400));

            setItemsPerPage(maxItems);
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);

        return () => {
            window.removeEventListener('resize', updateItemsPerPage);
        };
    }, []);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const fetchData = async (newFilter) => {
        try {
            const { services, totalCount } = await getServiceCardByTypeId(id, newFilter);
            if (services && services[0] && services[0].masters) {
                setServicesData(services[0].masters);
            } else {
                console.log('Data format is incorrect');
            }
            setTotalCount(totalCount);
        } catch (error) {
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
        }
    };

    useEffect(() => {
        setSortData([
            {
                field: "rating",
                direction: 'desc',
            },
            {
                field: "successOrdersAmount",
                direction: 'desc',
            }]);

            const nameFilter = {
                logic: "and",
                filters: [],
            };

            nameFilter.filters.push({
                field: "place.address",
                value: Cookies.get("city"),
                operator: "contains",
            });

        setFilterValuesData(nameFilter);
        filter.filter = nameFilter;
        filter.sort = [
            {
                field: "rating",
                direction: 'desc',
            },
            {
                field: "successOrdersAmount",
                direction: 'desc',
            }];
        const newFilter = { ...filter, take: itemsPerPage, skip: (currentPage - 1) * itemsPerPage };
        fetchData(newFilter);
    }, [id, filter, itemsPerPage, currentPage]);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
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

        const city = Cookies.get("city");

        if (city) {
            const cityFilter = {
                logic: "and",
                filters: [],
            };

            cityFilter.filters.push({
                field: "place.address",
                value: '"' + city + '"',
                operator: "contains",
            });

            filters.push(cityFilter);
        }

        if (masterNameValue) {
            const nameFilter = {
                logic: "and",
                filters: [],
            };

            nameFilter.filters.push({
                field: "executorName",
                value: '"' + masterNameValue + '"',
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

        const filter = filters.length > 1 ? {logic: "and", filters} : filters[0];

        const sort = Object.entries(sortOptions)
            .filter(([key, value]) => value !== null)
            .map(([key, value]) => ({
                field: key,
                direction: value,
            }));

        setSortData(sort);
        setFilterValuesData(filter);

        const requestBody = {
            take: itemsPerPage,
            skip: (currentPage - 1) * itemsPerPage,
            sort,
            filter,
            dates: selectedDates,
            times: timeRanges.map((timeRange) => ({
                startTime: timeRange.startTime ? new Date(`2023-11-02T${timeRange.startTime}:00.000Z`).toISOString()
                    : new Date(`2023-11-02T${"00:00"}:00.000Z`).toISOString(),
                endTime: timeRange.endTime ? new Date(`2023-11-02T${timeRange.endTime}:00.000Z`).toISOString()
                    : new Date(`2023-11-02T${"23:59"}:00.000Z`).toISOString(),
            })),
        };
        fetchData(requestBody);

        setIsFilterButtonVisible(false);
    };

    const handleFilterClear = () => {
        setSortOptions((prevSortOptions) => {
                return {
                    executorName: null,
                    price: null,
                    availableSlots: null,
                    rating: null,
                    duration: null,
                };
        });

        setMasterNameValue('');
        setPriceFromValue('');
        setPriceToValue('');
        setRatingFromValue('');
        setRatingToValue('');
        setDurationFromValue('');
        setDurationToValue('');

        document.getElementById("masterName").value = '';
        document.getElementById("priceFrom").value = '';
        document.getElementById("priceTo").value = '';
        document.getElementById("ratingFrom").value = '';
        document.getElementById("ratingTo").value = '';
        document.getElementById("durationFrom").value = '';
        document.getElementById("durationTo").value = '';

        setSelectedDates([]);
        setTimeRanges([]);
    };

/*    const renderToggle = (field, checked, onChange) => (
        <div style={{justifyContent: "space-between", display: "flex"}}>
            <div>
                <span className={`toggle-label ${theme === 'dark' ? 'dark' : ''}`}>{field}</span>

            </div>
            <div>
                <label style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['Min']}</label>
                <label className="toggle-switch">
                    <input type="checkbox" checked={checked} onChange={onChange}/>
                    <span className="toggle-slider"></span>
                </label>
                <label style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['Max']}</label>
            </div>
        </div>
    );*/

    const handleOrderClick = (executorServiceId) => {
        navigate("/calendar/" + executorServiceId);
    };

    let handleMasterNameClickClick = (masterId) => {
        navigate("/profile/" + masterId);
    };

    const SortArrow = ({theme, sortOptions, field, handleSortClick, handleCancelSortClick}) => {
        const isActive = sortOptions[field];
        console.log(isActive);
        return (
            <div className="price-inputs">
                <div className="input-group"
                     style={{
                         backgroundColor: theme === 'dark' ? '#252525' : '#eee',
                         borderRadius: "6px",
                         cursor: "pointer",
                         ...(isActive === 'asc' ? { backgroundColor: "#007bff" } : {})
                     }}>
                    <FontAwesomeIcon icon={faArrowUp} onClick={() => handleSortClick(field, 'asc')} flip="horizontal"
                                     style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                </div>
                <div className="input-group"
                     style={{
                         backgroundColor: theme === 'dark' ? '#252525' : '#eee',
                         borderRadius: "6px",
                         cursor: "pointer",
                         ...(isActive === 'desc' ? { backgroundColor: "#007bff" } : {})
                     }}>
                    <FontAwesomeIcon icon={faArrowDown} onClick={() => handleSortClick(field, 'desc')} flip="horizontal"
                                     style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                </div>
                <div className="input-group"
                     style={{
                         backgroundColor: theme === 'dark' ? '#252525' : '#eee',
                         borderRadius: "6px",
                         cursor: "pointer"
                     }}>
                    <FontAwesomeIcon icon={faXmark} onClick={() => handleCancelSortClick(field)} flip="horizontal"
                                     style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                </div>
            </div>

        );
    }

    const renderToggle = (field, checked, onChange) => {
        return (
            <div className="price-inputs">
                <div className="input-group"
                     style={{backgroundColor: theme === 'dark' ? '#252525' : '#eee', borderRadius: "6px", cursor: "pointer", ...(!checked ? {backgroundColor: "#007bff"} : {})}}
                     onClick={() => onChange(false)}>
                    <label style={theme === 'dark' ? {color: !checked ? "#fff" : ""} : {color: !checked ? "#fff" : ""}}>
                        {translations[language]['Min']}
                    </label>
                </div>
                <div className="input-group"
                     style={{backgroundColor: theme === 'dark' ? '#252525' : '#eee', borderRadius: "6px", cursor: "pointer", ...(checked ? {backgroundColor: "#007bff"} : {})}}
                     onClick={() => onChange(true)}>
                    <label style={theme === 'dark' ? {color: checked ? "#fff" : ""} : {color: checked ? "#fff" : ""}}>
                        {translations[language]['Max']}
                    </label>
                </div>
            </div>
        );
    };

    const handleDateChange = (date) => {
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

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
        setTimeRanges((prevRanges) => [...prevRanges, {startTime: null, endTime: null}]);
    };

    const handleRemoveTimeRange = (index) => {
        setTimeRanges((prevRanges) => {
            const newRanges = [...prevRanges];
            newRanges.splice(index, 1);
            return newRanges;
        });
    };

    const handleResetFilters = () => {
        setSelectedDates([]);
        setTimeRanges([]);
        //setTimeRanges([{startTime: null, endTime: null}]);
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

    const handleOptimizeServiceClick = async () => {

        const requestBody = {
            filterModel: {
                filter: {
                    logic: "and",
                    filters: [{
                        field: "place.address",
                        value: Cookies.get("city"),
                        operator: "contains",
                    }],
                }
            },
            serviceTypeId: id,
            conditions: [
                {column: 1, value: freeSlots, lambda: 0.4},
                {column: 2, value: priceSwitch, lambda: 0.2},
                {column: 3, value: ratingSwitch, lambda: 0.3},
                {column: 4, value: durationSwitch, lambda: 0.1},
            ],
        };
        const response = await getOptimalServiceCard(requestBody);
        setOprData(response);
        setOptimizeServiceModal(true);
        if (response){
            setShowOprResModal(true);
        }
    };

    const handleSortClick = (field, direction) => {
        setSortOptions((prevSortOptions) => {
            const newSortOptions = {...prevSortOptions, [field]: direction};
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
                    executorName: null,
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

    const isDateSelected = (date) => {
        return selectedDates.some((selectedDate) =>
            isSameDay(selectedDate, date)
        );
    };

    const handleFilterClick = () => {
        setShowFilterModal(true);
    };
    const handleOPRClick = () => {
        setOptimizeServiceModal(true);
    };
    const handlePeriodClick = () => {
        setShowPeriodModal(true);
    };

    const handleFilterButtonClick = () => {
        setIsFilterButtonVisible(!isFilterButtonVisible);
    };

    const handleFilterButtonCloseClick = () => {
        setIsFilterButtonVisible(false);
    };

    return (
        <div>
            <div key={id}>
                <div className='parent-container-type'>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
                        <h2 className={`type-name ${theme === 'dark' ? 'dark' : ''}`}>{name}</h2>
                        <div>
                            <FontAwesomeIcon icon={faFilter} onClick={handleFilterButtonClick} flip="horizontal" style={{ marginRight: "20px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                            <FontAwesomeIcon icon={faWandSparkles} onClick={handleOptimizeServiceClick} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                        </div>
                    </div>
{/*                    <div className="filter-button-container">
                                                <button className="filter-button" onClick={handlePeriodClick}>
                            {translations[language]['SelectionByDates']}
                        </button>
                        <button className="filter-button" onClick={handleFilterClick}>
                            {translations[language]['Filter']}
                        </button>
                        <button className="filter-button" onClick={handleOPRClick}>
                            {translations[language]['FindTheBestOption']}
                        </button>
                    </div>*/}
                </div>
                <div className='card-list'>
                    <div className="category-container">
                        {totalPages > 1 && (
                            <div className="pagination-arrow-container">
                                {currentPage > 1 && (
                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                                        onClick={goToPreviousPage}
                                    />
                                )}
                            </div>
                        )}
                        {servicesData.map((service) => (
                            <ServiceCard key={service.id} service={service} isProfile={false}/>
                        ))}
                        {totalPages > 1 && (
                            <div className="pagination-arrow-container">
                                {currentPage < totalPages && (
                                    <FontAwesomeIcon
                                        icon={faChevronRight}
                                        className={theme === "dark" ? "pagination-arrow-dark-theme" : "pagination-arrow-light-theme"}
                                        onClick={goToNextPage}
                                    />
                                )}
                            </div>
                        )}
                        <MapModal
                            isOpen={isModalOpen}
                            onRequestClose={() => setIsModalOpen(false)}
                            initialPosition={selectedPlace.position}
                            initialAddress={selectedPlace.address}
                        />
                    </div>
                </div>
            </div>

            <div className={`filter-overlay ${isFilterButtonVisible ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="filter-content ${theme === 'dark' ? 'dark' : ''}">
                    <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                        <FontAwesomeIcon icon={faXmark} onClick={handleFilterButtonCloseClick} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                    </div>
                    <div className={`price-filter ${theme === 'dark' ? 'dark' : ''}`}>
                        <label className="filter-title">{translations[language]['MasterName']}:</label>
                        <div className="price-inputs">
                            <div className={`input-group ${theme === 'dark' ? 'dark' : ''}`}>
                                <input defaultValue={masterNameValue} type={"text"}
                                       id="masterName" placeholder={"Helen"}/>
                            </div>
                        </div>
                    </div>
                    <div className="price-filter">
                        <label className="filter-title">{translations[language]['Cost']}:</label>
                        <div className="price-inputs">
                            <div className="input-group">
                                <label>{translations[language]['From']}</label>
                                <input
                                    defaultValue={priceFromValue} type="number"
                                    id="priceFrom" placeholder={"0"}
                                />
                            </div>
                            <div className="input-group">
                                <label>{translations[language]['To']}</label>
                                <input
                                    defaultValue={priceToValue} type="number"
                                    id="priceTo" placeholder={"110.5"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="price-filter">
                        <label className="filter-title">{translations[language]['Duration']}:</label>
                        <div className="price-inputs">
                            <div className="input-group">
                                <label>{translations[language]['From']}</label>
                                <input
                                    defaultValue={durationFromValue} type="time" id="durationFrom" />
                            </div>
                            <div className="input-group">
                                <label>{translations[language]['To']}</label>
                                <input defaultValue={durationToValue} type="time" id="durationTo" />
                            </div>
                        </div>
                    </div>
                    <div className="price-filter">
                        <label className="filter-title">{translations[language]['Rating']}:</label>
                        <div className="price-inputs">
                            <div className="input-group">
                                <label>{translations[language]['From']}</label>
                                <input
                                    defaultValue={ratingFromValue}
                                    type="number"
                                    id="ratingFrom"
                                    min="0"
                                    max="5"
                                    placeholder={"0"}
                                />
                            </div>
                            <div className="input-group">
                                <label>{translations[language]['To']}</label>
                                <input
                                    defaultValue={ratingToValue}
                                    type="number"
                                    id="ratingTo"
                                    min="0"
                                    max="5"
                                    placeholder={"5"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="price-filter" style={{display: "flex", justifyContent: "center"}}>
                        <h4 className="filter-title">{translations[language]['SortBy']}:</h4>
                        <label className="filter-title">{translations[language]['Name']}:</label>
                        <SortArrow theme={theme} sortOptions={sortOptions} field='executorName'
                                   handleSortClick={handleSortClick}
                                   handleCancelSortClick={handleCancelSortClick}/>
                        <label className="filter-title">{translations[language]['Cost']}:</label>
                        <SortArrow theme={theme} sortOptions={sortOptions} field='price'
                                   handleSortClick={handleSortClick}
                                   handleCancelSortClick={handleCancelSortClick}/>
                        <label className="filter-title">{translations[language]['AvailableSlots']}:</label>
                        <SortArrow theme={theme} sortOptions={sortOptions} field='availableSlots'
                                   handleSortClick={handleSortClick}
                                   handleCancelSortClick={handleCancelSortClick}/>
                        <label className="filter-title">{translations[language]['Rating']}:</label>
                        <SortArrow theme={theme} sortOptions={sortOptions} field='rating'
                                   handleSortClick={handleSortClick}
                                   handleCancelSortClick={handleCancelSortClick}/>
                        <label className="filter-title">{translations[language]['Duration']}:</label>
                        <SortArrow theme={theme} sortOptions={sortOptions} field='duration'
                                   handleSortClick={handleSortClick}
                                   handleCancelSortClick={handleCancelSortClick}/>
                    </div>
                    <div className="price-filter">
                        <label className="filter-title">{translations[language]['SelectionByDates']}:</label>
                        <div className={`${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}
                             style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <DatePicker
                                selected={null} // Установите выбранную дату в null, чтобы позволить выбирать дни
                                onChange={handleDateChange}
                                inline // Рендер календаря всегда видимым
                                dayClassName={(date) => (isDateSelected(date) ? 'selected' : '')} // Добавляем класс к выделенным дням
                                locale={language}
                            />
                        </div>

                        {timeRanges.map((timeRange, index) => (
                            <div key={index} className="price-inputs">
                                <div className="input-group">
                                    <label>{index + 1}) {translations[language]['To']}</label>
                                    <input
                                        defaultValue={ratingFromValue}
                                        type="time"
                                        value={timeRange.startTime || '00:00'}
                                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>{translations[language]['To']}</label>
                                    <input
                                        type="time"
                                        value={timeRange.endTime || '23:59'}
                                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                                    />
                                </div>
                                {index > -1 && (
                                    <FontAwesomeIcon icon={faTrash} onClick={() => handleRemoveTimeRange(index)} flip="horizontal" style={{ color: "red", marginTop: "25px"}}/>
                                )}
                            </div>
                        ))}
                        <button className="filter-button"
                                onClick={handleAddTimeRange}>{translations[language]['AddTimeRange']}</button>
                    </div>
                </div>
                <div className="price-inputs">
                    <div className="input-group">
                        <button className="filter-button" style={{color: "red", borderColor: 'red'}} onClick={handleFilterClear}>{translations[language]['Clear']}</button>
                    </div>
                    <div className="input-group">
                        <button className="filter-button" onClick={handleFilterApply}>{translations[language]['Apply']}</button>
                    </div>
                </div>
            </div>

            <div className={`filter-overlay ${optimizeServiceModal ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="filter-content">
                    <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                        <FontAwesomeIcon icon={faXmark} onClick={() => setOptimizeServiceModal(false)} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                    </div>
                    <div className="price-filter" style={{display: "flex", justifyContent: "center"}}>
                        <h4 className="filter-title">{translations[language]['FindTheBestOption']}:</h4>
                        <label className="filter-title">{translations[language]['Cost']}:</label>
                        {renderToggle(translations[language]['Cost'], priceSwitch, () => handleSwitchChange('price'))}
                        <label className="filter-title">{translations[language]['AvailableSlots']}:</label>
                        {renderToggle(translations[language]['AvailableSlots'], freeSlots, () => handleSwitchChange('freeSlots'))}
                        <label className="filter-title">{translations[language]['Rating']}:</label>
                        {renderToggle(translations[language]['Rating'], ratingSwitch, () => handleSwitchChange('rating'))}
                        <label className="filter-title">{translations[language]['Duration']}:</label>
                        {renderToggle(translations[language]['Duration'], durationSwitch, () => handleSwitchChange('duration'))}
                    </div>
                    <div className="price-inputs">
                        <div className="input-group" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <button className="filter-button"
                                    onClick={handleOptimizeServiceClick}>{translations[language]['OptimizeService']}</button>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        {showOprResModal && (
                            <div className={`service-card ${theme === 'dark' ? 'dark' : ''}`}>
                                <div key={oprData.id} className="master-card">
                                    <div className="photos">
                                        <PhotoList photos={oprData.photos} size={300} canDelete={false}/>
                                    </div>
                                    <div className="master-info">
                                        <h4 onClick={() => handleMasterNameClickClick(oprData.executorId)}>{oprData.name}</h4>
                                        <h4>{oprData.rating} <FontAwesomeIcon icon={faStar} className='item-icon'/></h4>
                                    </div>
                                    <div className="service-description">
                                        <p>{oprData.description}</p>
                                        <p><FontAwesomeIcon icon={faHouse} className='item-icon'/>{oprData.address}</p>
                                        <p>Available Slots: {oprData.availableSlots}</p>
                                    </div>
                                    <div className="master-info">
                                        <h4><FontAwesomeIcon icon={faClock} className='item-icon'/> {oprData.duration}
                                        </h4>
                                        <h4>{oprData.price} Byn</h4>
                                    </div>
                                    <div>
                                        <button className="order-button" onClick={() => handleOrderClick(oprData.id)}>
                                            <p className="order-text"><FontAwesomeIcon
                                                icon={faBoltLightning}/> Записаться</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

{/*            {showFilterModal && (
                <div className={`filter-modal ${theme === 'dark' ? 'dark' : ''}`}>
                    <div className={`modal-content ${theme === 'dark' ? 'dark' : ''}`}>
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
                        <div className="flex-container" style={{justifyContent: "space-between", display: "flex"}}>
                            <div style={{maxWidth: "48%"}}>
                                <h2 className="dropzone-centrize"
                                    style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['Filter']}</h2>
                                <div style={{justifyContent: "space-between", display: "flex", marginTop: "5px"}}>
                                    <label style={theme === 'dark' ? {color: "white"} : {}}
                                           htmlFor="durationFrom">{translations[language]['Duration']}:</label>
                                    <div>
                                        <input defaultValue={durationFromValue} style={{width: 'auto'}} type="time"
                                               id="durationFrom" placeholder="Enter duration"
                                               className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                        />
                                        <label style={theme === 'dark' ? {color: "white"} : {}}> - </label>
                                        <input defaultValue={durationToValue} style={{width: 'auto'}} type="time"
                                               id="durationTo"
                                               placeholder="Enter duration"
                                               className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                        />
                                    </div>
                                </div>
                                <div style={{justifyContent: "space-between", display: "flex", marginTop: "5px"}}>
                                    <label style={theme === 'dark' ? {color: "white"} : {}} htmlFor="priceFrom">{translations[language]['Cost']}:</label>
                                    <div>
                                        <input defaultValue={priceFromValue} style={{width: '8ch'}} type="number"
                                               id="priceFrom"
                                               placeholder={translations[language]['From']}
                                               className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                        />
                                        <label style={theme === 'dark' ? {color: "white"} : {}}> - </label>
                                        <input defaultValue={priceToValue} style={{width: '8ch'}} type="number"
                                               id="priceTo"
                                               placeholder={translations[language]['To']}
                                               className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                        />
                                    </div>
                                </div>
                                <div style={{justifyContent: "space-between", display: "flex", marginTop: "5px"}}>
                                    <label style={theme === 'dark' ? {color: "white"} : {}} htmlFor="masterName">{translations[language]['MasterName']}:</label>
                                    <input defaultValue={masterNameValue} style={{width: '45%'}}
                                           className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                           id="masterName" placeholder={translations[language]['EnterMasterName']}/>
                                </div>
                                <div style={{justifyContent: "space-between", display: "flex", marginTop: "5px"}}>
                                    <label style={theme === 'dark' ? {color: "white"} : {}}
                                           htmlFor="rating">{translations[language]['Rating']}:</label>
                                    <div>
                                        <input
                                            defaultValue={ratingFromValue}
                                            type="number"
                                            id="ratingFrom"
                                            min="0"
                                            max="5"
                                            style={{width: "4ch"}}
                                            className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                        />
                                        <label style={theme === 'dark' ? {color: "white"} : {}}> - </label>
                                        <input
                                            defaultValue={ratingToValue}
                                            type="number"
                                            id="ratingTo"
                                            min="0"
                                            max="5"
                                            className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                            style={{width: "4ch"}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{maxWidth: "50%", minWidth: "48%"}}>
                                <h3 className="dropzone-centrize" style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['SortBy']}:</h3>
                                <div>
                                    <div style={{justifyContent: "space-between", display: "flex"}}>
                                        <div>
                                            <label
                                                style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['Name']}:</label>
                                        </div>
                                        <div>
                                            <SortArrow theme={theme} sortOptions={sortOptions} field='executorName'
                                                       handleSortClick={handleSortClick}
                                                       handleCancelSortClick={handleCancelSortClick}/>
                                        </div>
                                    </div>
                                    <div style={{justifyContent: "space-between", display: "flex"}}>
                                        <div>
                                            <label
                                                style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['Cost']}:</label>
                                        </div>
                                        <div>
                                            <SortArrow theme={theme} sortOptions={sortOptions} field='price'
                                                       handleSortClick={handleSortClick}
                                                       handleCancelSortClick={handleCancelSortClick}/>
                                        </div>
                                    </div>
                                    <div style={{justifyContent: "space-between", display: "flex"}}>
                                        <div>
                                            <label
                                                style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['AvailableSlots']}:</label>
                                        </div>
                                        <div>
                                            <SortArrow theme={theme} sortOptions={sortOptions} field='availableSlots'
                                                       handleSortClick={handleSortClick}
                                                       handleCancelSortClick={handleCancelSortClick}/>
                                        </div>
                                    </div>
                                    <div style={{justifyContent: "space-between", display: "flex"}}>
                                        <div>
                                            <label
                                                style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['Rating']}:</label>
                                        </div>
                                        <div>
                                            <SortArrow theme={theme} sortOptions={sortOptions} field='rating'
                                                       handleSortClick={handleSortClick}
                                                       handleCancelSortClick={handleCancelSortClick}/>
                                        </div>
                                    </div>
                                    <div style={{justifyContent: "space-between", display: "flex"}}>
                                        <div>
                                            <label
                                                style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['Duration']}:</label>
                                        </div>
                                        <div>
                                            <SortArrow theme={theme} sortOptions={sortOptions} field='duration'
                                                       handleSortClick={handleSortClick}
                                                       handleCancelSortClick={handleCancelSortClick}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dropzone-centrize">
                            <button className="filter-button" onClick={handleFilterClear}>{translations[language]['Clear']}</button>
                            <button className="filter-button" onClick={handleFilterApply}>{translations[language]['ApplyFilters']}</button>
                        </div>
                    </div>
                </div>
            )}
            {optimizeServiceModal && (
                <div className={`filter-modal ${theme === 'dark' ? 'dark' : ''}`}>
                    <div className={`modal-content-optimal ${theme === 'dark' ? 'dark' : ''}`}>
                        <span className="close" onClick={() => setOptimizeServiceModal(false)}>
                            &times;
                        </span>
                        <div>
                            <div className="dropzone-centrize">
                                <h2 style={theme === 'dark' ? {color: "white"} : {}}>{translations[language]['OptimizeService']}</h2>
                            </div>
                            <div>
                                {renderToggle(translations[language]['AvailableSlots'], freeSlots, () => handleSwitchChange('freeSlots'))}
                            </div>
                            <div>
                                {renderToggle(translations[language]['Cost'], priceSwitch, () => handleSwitchChange('price'))}
                            </div>
                            <div>
                                {renderToggle(translations[language]['Rating'], ratingSwitch, () => handleSwitchChange('rating'))}
                            </div>
                            <div>
                                {renderToggle(translations[language]['Duration'], durationSwitch, () => handleSwitchChange('Duration'))}
                            </div>
                            <div className="dropzone-centrize">
                                <button className="filter-button"
                                        onClick={handleOptimizeServiceClick}>{translations[language]['OptimizeService']}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showOprResModal && (
                <div className={`filter-modal ${theme === 'dark' ? 'dark' : ''}`}>
                    <div className={`modal-content ${theme === 'dark' ? 'dark' : ''}`}>
                        <span className="close" onClick={() => setShowOprResModal(false)}>
                            &times;
                        </span>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div className="service-card">
                                <div key={oprData.id} className="master-card">
                                    <div className="photos">
                                        <PhotoList photos={oprData.photos} size={300} canDelete={false}/>
                                    </div>
                                    <div className="master-info">
                                        <h4 onClick={() => handleMasterNameClickClick(oprData.executorId)}>{oprData.name}</h4>
                                        <h4>{oprData.rating} <FontAwesomeIcon icon={faStar} className='item-icon'/></h4>
                                    </div>
                                    <div className="service-description">
                                        <p>{oprData.description}</p>
                                        <p><FontAwesomeIcon icon={faHouse} className='item-icon'/>{oprData.address}</p>
                                        <p>Available Slots: {oprData.availableSlots}</p>
                                    </div>
                                    <div className="master-info">
                                        <h4><FontAwesomeIcon icon={faClock} className='item-icon'/> {oprData.duration}
                                        </h4>
                                        <h4>{oprData.price} Byn</h4>
                                    </div>
                                    <div>
                                        <button className="order-button" onClick={() => handleOrderClick(oprData.id)}>
                                            <p className="order-text"><FontAwesomeIcon
                                                icon={faBoltLightning}/> Записаться</p>
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
                        <div className="dropzone-centrize">
                            <div>
                                <DatePicker
                                    selected={null} // Установите выбранную дату в null, чтобы позволить выбирать дни
                                    onChange={handleDateChange}
                                    inline // Рендер календаря всегда видимым
                                    dayClassName={(date) => (isDateSelected(date) ? 'selected' : '')} // Добавляем класс к выделенным дням
                                    locale={language}
                                />
                            </div>
                            {timeRanges.map((timeRange, index) => (
                                <div key={index}>
                                    <label>Time Range {index + 1}:</label>
                                    <input
                                        type="time"
                                        value={timeRange.startTime || '00:00'}
                                        style={{width: "auto"}}
                                        className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                                    />
                                    <span> - </span>
                                    <input
                                        type="time"
                                        style={{width: "auto"}}
                                        className={`newAppointmentForm-input ${theme === 'dark' ? 'dark' : ''}`}
                                        value={timeRange.endTime || '23:59'}
                                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                                    />
                                    {index > -1 && (
                                        <button onClick={() => handleRemoveTimeRange(index)}>
                                            Remove Time Range
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button className="filter-button"
                                    onClick={handleAddTimeRange}>{translations[language]['AddTimeRange']}</button>
                            <button className="filter-button"
                                    onClick={handleResetFilters}>{translations[language]['ResetFilters']}</button>
                            <button className="filter-button"
                                    onClick={handleFilterApply}>{translations[language]['ApplyFilters']}</button>
                        </div>
                    </div>
                </div>
            )}*/}
        </div>
    );
};

export default ServiceCardTypeList;
