import IconComponent from "./IconComponent";
import React, {useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {ThemeContext} from "./ThemeContext";
import {getAllServiceTypes} from "./api";
import LoadingSpinner from "./LoadingSpinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons/faArrowLeft";

const AllCategories = ({ initialCategories, isEditServiceCard, onSelectCategory }) => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [categories, setCategories] = useState(initialCategories || []);
    const [parentName, setParentName] = useState("");
    const [history, setHistory] = useState([]); // Для перехода назад
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const { state } = useLocation(); // Получаем состояние из маршрута

    const fetchCategories = async (parentId) => {
        setIsLoading(true);
        const newCategories = await getAllServiceTypes(parentId);
        setIsLoading(false);

        if (newCategories && newCategories.length > 0) {
            setCategories(newCategories);
            setParentName(newCategories[0]?.parentName || "Категории");
            setIsEmpty(false);
        } else {
            setCategories([]);
            setIsEmpty(true);
        }
    };

    useEffect(() => {
        // Если передан parentId, загружаем дочерние элементы
        if (state?.parentId) {
            fetchCategories(state.parentId);
        } else if (!initialCategories) {
            fetchCategories(null);
        }
    }, [state, initialCategories]);

    const handleCategoryClick = async (category) => {
        if (category.isFinal) {
            if (isEditServiceCard) {
                onSelectCategory(category.id, category.name); // Возвращаем id
            } else {
                navigate(`/collection/category/${category.id}`); // Перенаправляем на страницу
            }
        } else {
            // Если это не конечная категория, грузим дочерние
            setHistory((prev) => [...prev, { categories, parentName }]);
            await fetchCategories(category.id);
        }
    };

    const handleBackClick = () => {
        const lastState = history.pop();
        if (lastState) {
            setCategories(lastState.categories);
            setParentName(lastState.parentName);
            setHistory([...history]);
        } else {
            navigate("/"); // Возврат на главную, если истории больше нет
        }
    };

    useEffect(() => {
        if (!initialCategories) {
            fetchCategories(null);
        }
    }, [initialCategories]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isEmpty) {
        return (
            <div className={`empty-state ${theme === "dark" ? "dark" : ""}`}>
                <p>Данные не найдены</p>
            </div>
        );
    }

    return (
        <div className={`all-categories-container ${theme === "dark" ? "dark" : ""}`}>
            {history.length > 0 && (
                <div className="back-button" onClick={handleBackClick}>
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        style={{
                            cursor: "pointer",
                            marginRight: "10px",
                            ...(theme === "dark" ? { color: "white" } : { color: "#000" }),
                        }}
                    />
                    {parentName}
                </div>
            )}
            <div className="all-category-type-container">
                <div className="all-category-list">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={theme === "dark" ? "main-category-item-dark-theme" : "main-category-item-light-theme"}
                        onClick={() => handleCategoryClick(category)}
                    >
                        <IconComponent iconName={category.icon} className={theme === "dark" ? "main-category-icon-dark-theme" : "main-category-icon-light-theme"} />
                        <div className={theme === "dark" ? "main-category-name-dark-theme" : "main-category-name-light-theme"}>{category.name}</div>
                    </button>
                ))}
            </div>
            </div>
        </div>
    );
};

export default AllCategories;