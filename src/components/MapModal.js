import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Modal from 'react-modal';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { divIcon } from 'leaflet';
import '../styles/MapModal.css';

const MapWithEvents = ({ setPosition, setAddress }) => {
    const map = useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng);

            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();

            if (data && data.display_name) {
                console.log(data.display_name.toString());
                setAddress(data.display_name.toString());
            } else {
                setAddress(`LatLng(${lat}, ${lng})`);
            }
        },
    });

    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider: provider,
            showMarker: true,
            autoClose: true,
        });
        map.addControl(searchControl);
        return () => {
            map.removeControl(searchControl);
        };
    }, [map]);

    return null;
};


const MapModal = ({ isOpen, onRequestClose, onSaveAddress, initialPosition, initialAddress }) => {
    const [position, setPosition] = useState(initialPosition || { lat: 51.505, lng: -0.09 });
    const [address, setAddress] = useState(initialAddress || '');


    useEffect(() => {
        if (isOpen) {
            setPosition(initialPosition);
            setAddress(initialAddress);
        } else {
            setPosition(null);
            setAddress('');
        }
    }, [isOpen, initialPosition, initialAddress]);

    const myCustomMarker = divIcon({
        className: 'my-custom-icon',
        html: `<i>!</i>`,
        iconSize: [12, 20],
        iconAnchor: [12, 20],
    });

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
                content: {
                    height: '80vh',
                    overflow: 'auto',
                },
            }}
        >
            <span className="close" onClick={onRequestClose}>
                &times;
            </span>
            {position && <button onClick={() => { onSaveAddress({ position, address }); onRequestClose(); }}>Сохранить адрес</button>}
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapWithEvents setPosition={setPosition} setAddress={setAddress} />
                {position && (
                    <Marker
                        position={position}
                        icon={myCustomMarker}
                        eventHandlers={{
                            click: () => {
                                onSaveAddress({ position, address });
                                onRequestClose();
                            },
                        }}>
                        <Popup>
                            {address || `LatLng(${position.lat}, ${position.lng})`}<br />
                            <button onClick={() => { onSaveAddress({ position, address }); onRequestClose(); }}>Сохранить адрес</button>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </Modal>
    );
};

export default MapModal;