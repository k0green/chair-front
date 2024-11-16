import React from 'react';
import CategoryItem from './CategoryItem';
import "../styles/CategoryItem.css";

const AllChildrenCategory = ({categories, isEditServiceCard, userId}) => {

    return (
        <div className="all-category-type-container">
            <div className="all-category-list">
                {categories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        id={category.id}
                        name={category.name}
                        icon={category.icon}
                        isEditServiceCard={isEditServiceCard}
                        userId = {userId}
                    />
                ))}
            </div>
        </div>
    );
};

export default AllChildrenCategory;

