import React, {useState, useEffect, useRef, useContext} from 'react';
import Modal from 'react-modal';
import '../styles/MapModal.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {ThemeContext} from "./ThemeContext";

const MapModal = ({ isOpen, onRequestClose, onSaveAddress, initialPosition, initialAddress, apiKey, canEdit }) => {
    const [position, setPosition] = useState({lat: 53.90215390255788, lng: 27.56189595549677});
    const [address, setAddress] = useState(initialAddress || '');
    const [selectedObject, setSelectedObject] = useState(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const searchRef = useRef(null);
    const mapLoadedRef = useRef(false); // Map loaded flag
    const { theme } = useContext(ThemeContext);

    const initialMarkerRef = useRef(null);

    const setDefaultPosition = (position) => { if (!position.lat || !position.lng) { return {lat: 53.90215390255788, lng: 27.56189595549677}; } return position; };

    useEffect(() => {
        if(initialPosition)
            initialPosition = setDefaultPosition(initialPosition);
        const loadMap = () => {
            if (!window.ymaps || mapLoadedRef.current) return;

            window.ymaps.ready(() => {
                const map = new window.ymaps.Map(mapRef.current, {
                    center: [initialPosition.lat, initialPosition.lng],
                    zoom: 18,
                });

                mapInstanceRef.current = map;

                const sC = map.controls.get('searchControl');
                if (sC) {
                    map.controls.remove(sC)
                }

                const updateAddress = (coords) => {
                    if(canEdit) {
                        window.ymaps.geocode(coords).then((res) => {
                            const firstGeoObject = res.geoObjects.get(0);
                            const newAddress = firstGeoObject.getAddressLine();
                            setAddress(newAddress);
                        });
                    }
                };

                // Create and set the initial marker
                const initialMarker = new window.ymaps.Placemark(
                    [initialPosition.lat, initialPosition.lng],
                    { balloonContent: address },
                    { draggable: true }
                );

                if(canEdit) {
                    initialMarker.events.add('dragend', function (e) {
                        const coords = e.get('target').geometry.getCoordinates();
                        setPosition({lat: coords[0], lng: coords[1]});
                        updateAddress(coords);
                    });
                }

                map.geoObjects.add(initialMarker);
                initialMarkerRef.current = initialMarker;

                let currentMarker = null;

                if(canEdit)
                {
                    map.events.add('click', function (e) {
                        const coords = e.get('coords');
                        setPosition({ lat: coords[0], lng: coords[1] });
                        updateAddress(coords);

                        // Remove the initial marker if it exists
                        if (initialMarkerRef.current) {
                            map.geoObjects.remove(initialMarkerRef.current);
                            initialMarkerRef.current = null; // Clear the reference
                        }

                        // Remove the previous marker if it exists
                        if (currentMarker) {
                            map.geoObjects.remove(currentMarker);
                        }

                        const newMarker = new window.ymaps.Placemark(coords, {
                            balloonContent: `LatLng(${coords[0]}, ${coords[1]})`,
                        }, {
                            draggable: true,
                        });

                        newMarker.events.add('dragend', function (e) {
                            const coords = e.get('target').geometry.getCoordinates();
                            setPosition({ lat: coords[0], lng: coords[1] });
                            updateAddress(coords);
                        });

                        map.geoObjects.add(newMarker);
                        currentMarker = newMarker;
                        setSelectedObject(null);
                        setSelectedObject(newMarker);
                    });
                }

                const searchControl = new window.ymaps.control.SearchControl({
                    options: {
                        noPlacemark: true,
                        resultsPerPage: 5,
                        provider: 'yandex#search',
                        noSuggestPanel: true,
                    },
                });

                searchControl.events.add('resultselect', function (e) {
                    const index = e.get('index');
                    searchControl.getResult(index).then((res) => {
                        const coords = res.geometry.getCoordinates();
                        setPosition({ lat: coords[0], lng: coords[1] });
                        setAddress(res.getAddressLine());

                        if (selectedObject) {
                            map.geoObjects.remove(selectedObject);
                        }

                        const newMarker = new window.ymaps.Placemark(coords, {
                            balloonContent: res.getAddressLine(),
                        }, {
                            draggable: true,
                        });

                        if(canEdit) {
                            newMarker.events.add('dragend', function (e) {
                                const coords = e.get('target').geometry.getCoordinates();
                                setPosition({lat: coords[0], lng: coords[1]});
                                updateAddress(coords);
                            });
                        }

                        map.geoObjects.add(newMarker);
                        setSelectedObject(newMarker);
                        map.setCenter(coords);
                    });
                });

                map.controls.add(searchControl);
                searchRef.current = searchControl;

                mapLoadedRef.current = true;
            });
        };

        if (isOpen) {
            if (!window.ymaps) {
                const script = document.createElement('script');
                script.src = `https://api-maps.yandex.ru/2.1/?apikey=d2aa6dcc-1f35-4ed7-a13b-fe4064f9904f&lang=ru_RU`;
                script.onload = loadMap;
                script.onerror = () => console.error('Failed to load Yandex Maps API');
                document.body.appendChild(script);
            } else {
                loadMap();
            }
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.geoObjects.removeAll();
                mapInstanceRef.current.destroy(); // Clean up the map instance
                mapInstanceRef.current = null;
            }
            mapLoadedRef.current = false;

            if (searchRef.current) {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.controls.remove(searchRef.current);
                }
                searchRef.current = null;
            }
        };
    }, [isOpen, initialPosition, initialAddress, apiKey]);

    useEffect(() => {
        if (!isOpen) {
            setPosition(null);
            setAddress('');
        } else {
            setPosition(initialPosition);
            setAddress(initialAddress);
        }
    }, [isOpen, initialPosition, initialAddress]);

    return (
        <div className={`filter-overlay ${isOpen ? 'visible' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="filter-content">
                <div style={{ display: "flex", justifyContent: "right", width: "95%" }}>
                    <FontAwesomeIcon icon={faXmark} onClick={() => onRequestClose()} flip="horizontal" style={{ marginRight: "0px", ...(theme === 'dark' ? { color: "white" } : { color: "#000" })}}/>
                </div>
                <div style={{height: "100vh"}}>
                    {position && address && (
                        <button
                            onClick={() => {
                                onSaveAddress({ position, address });
                                onRequestClose();
                            }}
                        >
                            Сохранить адрес
                        </button>
                    )}
                    <div
                        ref={mapRef}
                        style={{ height: '100%', width: '100%' }}
                        key={isOpen ? 'map-container' : 'map-container-hidden'} // Force remount when modal opens
                    />
                </div>
            </div>
        </div>
    );
};

export default MapModal;
