import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import Select from 'react-select';
import Cookies from "js-cookie";

const YANDEX_API_KEY = 'd2aa6dcc-1f35-4ed7-a13b-fe4064f9904f';

const CitySelector = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(Cookies.get('city'));
    const [cookies, setCookie] = useCookies(['city']);

    // Получение городов через Yandex Geocoder API
    const fetchCities = async (query) => {
        if (!query) return;

        try {
            const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_API_KEY}&format=json&geocode=${query}&results=5`);
            const data = await response.json();

            // Парсим данные и получаем города, убедимся что 'name' и 'description' являются строками
            const foundCities = data.response.GeoObjectCollection.featureMember.map(item => {
                const geoObject = item.GeoObject;
                const cityName = geoObject.name || '';
                const cityDescription = geoObject.description || '';

                return {
                    label: `${cityName}, ${cityDescription}`,  // строка для отображения
                    value: cityName                            // значение для идентификации
                };
            });

            setCities(foundCities);
        } catch (error) {
            console.error('Ошибка при получении данных от Yandex Geocoder:', error);
        }
    };

    const handleCitySelect = (city) => {
        if (city) {
            setSelectedCity(city);
            setCookie('city', city.value, { path: '/' });
        } else {
            setSelectedCity(null);
            setCookie('city', '', { path: '/' });
        }
    };


    return (
        <div>
            <label>Выберите город:</label>
            <Select
                options={cities}
                value={selectedCity}
                onInputChange={(inputValue) => {
                    fetchCities(inputValue);
                }}
                onChange={handleCitySelect}
                placeholder="Введите город"
                isClearable
                filterOption={null}
            />
        </div>
    );
};

export default CitySelector;
