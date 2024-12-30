import React, {useContext, useEffect, useRef, useState} from 'react';
import ServiceCard from '../components/ServiceCard';
import "../styles/ServiceCard.css";
import { ThemeContext } from "../components/ThemeContext";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import MapModal from "../components/MapModal";
import { useNavigate } from "react-router-dom";
import {getOptimalServiceCard, getServiceCardByTypeId} from '../components/api';
import PhotoList from "../components/PhotoList";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {faBoltLightning, faClock, faHouse, faStar} from "@fortawesome/free-solid-svg-icons";
import {LanguageContext} from "../components/LanguageContext";
import {isSameDay} from "date-fns";
import Cookies from "js-cookie";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faFilter} from "@fortawesome/free-solid-svg-icons/faFilter";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons/faArrowDown";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons/faArrowUp";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faWandSparkles} from "@fortawesome/free-solid-svg-icons/faWandSparkles";
import LoadingSpinner from "../components/LoadingSpinner";
import FilterCalendar from "../components/FilterCalendar";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons/faArrowLeft";

const ServiceCardTypeList = ({ id, name, parentTypeId, filter, itemPerPage = 2 }) => {
    const { theme } = useContext(ThemeContext);
    const [servicesData, setServicesData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemPerPage);
    const [selectedPlace, setSelectedPlace] = useState({ position: null, address: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalCount, setTotalCount] = useState(5);
    const {language, translations} = useContext(LanguageContext);
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
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const uniqueServiceIds = useRef(new Set());

    const fetchData = async (skip) => {
        try {
            setIsLoading(true);

            const sorting = [
                { field: "rating", direction: 'desc' },
                { field: "successOrdersAmount", direction: 'desc' },
            ];

            const nameFilter = {
                logic: "and",
                filters: [{
                    field: "place.address",
                    value: Cookies.get("city"),
                    operator: "contains",
                }],
            };

            const newFilter = {
                ...filter,
                filter: nameFilter,
                sort: sorting,
                take: itemPerPage,
                skip,
            };

            const { services, totalCount } = await getServiceCardByTypeId(id, newFilter);
            if (services && services[0] && services[0].masters) {
                const uniqueMasters = services[0].masters.filter(service => {
                    if (uniqueServiceIds.current.has(service.id)) {
                        return false;
                    } else {
                        uniqueServiceIds.current.add(service.id);
                        return true;
                    }
                });
                setServicesData(prevServicesData => [...prevServicesData, ...uniqueMasters]);
            } else {
                console.log('Data format is incorrect');
            }
            setTotalCount(totalCount);
            setIsEmpty(services.length === 0);
        } catch (error) {
            const errorMessage = error.message || 'Failed to fetch data';
            if (!toast.isActive(errorMessage)) {
                toast.error(errorMessage);
            }
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadNextPage = () => {
        if (!isLoading && (currentPage * itemPerPage) < totalCount) {
            setCurrentPage(prevPage => prevPage + 1);
            fetchData(currentPage * itemPerPage);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                loadNextPage();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, isLoading, totalCount]);

    useEffect(() => {
        fetchData(0);
    }, [id]);





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

    const handleFilterButtonClick = () => {
        setIsFilterButtonVisible(!isFilterButtonVisible);
    };

    const handleFilterButtonCloseClick = () => {
        setIsFilterButtonVisible(false);
    };

    const FilterDatePicker = ({ selectedDate, handleDateChange, theme, language }) => (
        <div className={`calendar-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
            <div className="calendar-styled">
                <DatePicker
                    selected={null}
                    onChange={handleDateChange}
                    dayClassName={(date) => (isDateSelected(date) ? 'selected' : '')}
                    locale={language}
                />
            </div>
        </div>
    );

    const handleBackClick = async () => {
        navigate('/all-child-categories/' + parentTypeId);
    };

    return (
        <div>
            <div className='parent-container-type'>
                <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
                    <h2 className={`type-name ${theme === 'dark' ? 'dark' : ''}`}>
                        { parentTypeId ? <FontAwesomeIcon icon={faArrowLeft} onClick={handleBackClick} style={{ cursor: "pointer", marginRight: "20px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/> : ""}
                        {name}
                    </h2>
                    <div>
                        <FontAwesomeIcon icon={faFilter} onClick={handleFilterButtonClick} flip="horizontal" style={{ marginRight: "20px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                        <FontAwesomeIcon icon={faWandSparkles} onClick={handleOptimizeServiceClick} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                    </div>
                </div>
            </div>
            <div className="card-container-test">
            <div className='card-list'>
                    {isLoading && <LoadingSpinner isLocal={true} />}
                    {isEmpty ? (
                        <div className={`empty-state ${theme === 'dark' ? 'dark' : ''}`}>
                            <p>No messages</p>
                        </div>
                    ) : (
                        servicesData.map(service => (
                            <ServiceCard key={service.id} service={service} isProfile={false} />
                        ))
                    )}
                    <MapModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        initialPosition={selectedPlace.position}
                        initialAddress={selectedPlace.address}
                    />
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
                            <FilterCalendar onDateChange={handleDateChange} selectedDates={selectedDates} />
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
        </div>
    );
};

export default ServiceCardTypeList;
