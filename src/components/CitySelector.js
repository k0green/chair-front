import React, {useContext, useState} from 'react';
import { useCookies } from 'react-cookie';
import Select from 'react-select';
import Cookies from "js-cookie";
import {ThemeContext} from "./ThemeContext";

const YANDEX_API_KEY = 'd2aa6dcc-1f35-4ed7-a13b-fe4064f9904f';

const CitySelector = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(Cookies.get('city'));
    const [cookies, setCookie] = useCookies(['city']);
    const {theme, toggleTheme} = useContext(ThemeContext);

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

    const customStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: theme === 'dark' ? '#252525' : '#ffffff',
            color: theme === 'dark' ? '#fff' : '#000000',
            borderColor: theme === 'dark' ? '#333333' : '#cccccc'
        }),
        singleValue: (styles) => ({
            ...styles,
            color: theme === 'dark' ? '#fff' : '#000000'
        }),
        placeholder: (styles) => ({
            ...styles,
            color: theme === 'dark' ? '#aaaaaa' : '#cccccc'
        }),
        menu: (styles) => ({
            ...styles,
            backgroundColor: theme === 'dark' ? '#252525' : '#ffffff',
            color: theme === 'dark' ? '#fff' : '#000000'
        }),
        option: (styles, { isFocused }) => ({
            ...styles,
            backgroundColor: isFocused ? (theme === 'dark' ? '#333333' : '#f0f0f0') : undefined,
            color: theme === 'dark' ? '#fff' : '#000000'
        }),
        input: (styles) => ({
            ...styles,
            color: theme === 'dark' ? '#ffffff' : '#000000' // Цвет вводимого текста
        })
    };

    return (
        <div style={{display: "flex", textAlign: "left", flexDirection: "column"}}>
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
                styles={customStyles}
            />
        </div>
    );
};

export default CitySelector;
