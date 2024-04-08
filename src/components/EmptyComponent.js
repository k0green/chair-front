import React from 'react';
import {useNavigate} from 'react-router-dom';

const ImageWithButton = ({ imageUrl, text }) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/");
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '10vh' }}>
            <img src={imageUrl} alt="Centered" style={{ width: '50%', scale: '0.3', objectFit: 'cover' }} />
            <div style={{marginTop: "-300px", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '10vh'}}>
                <p>{text}</p>
                <button style={{backgroundColor: "transparent", borderRadius: "5px", borderColor: "#007bff", fontSize: "16px", color: "#007bff"}} onClick={handleButtonClick}>
                    Вернуться на главную
                </button>
            </div>
        </div>
    );
};

export default ImageWithButton;
