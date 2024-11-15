import React, { useState, useRef, useEffect } from "react";
import "../styles/InfoTooltip.css";

const InfoTooltip = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [align, setAlign] = useState("center");
    const tooltipRef = useRef(null);

    const handleMouseEnter = () => {
        setIsVisible(true);
        adjustTooltipPosition();
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    const handleClick = () => {
        setIsVisible((prev) => !prev);
    };

    const adjustTooltipPosition = () => {
        if (tooltipRef.current) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;

            if (tooltipRect.left < 0) {
                setAlign("left");
            } else if (tooltipRect.right > windowWidth) {
                setAlign("right");
            } else {
                setAlign("center");
            }
        }
    };

    useEffect(() => {
        if (isVisible) {
            adjustTooltipPosition();
        }
    }, [isVisible]);

    return (
        <div
            className="info-tooltip-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
        >
            <span className="info-icon">i</span>
            {isVisible && (
                <div
                    className="tooltip"
                    ref={tooltipRef}
                    data-align={align}
                >
                    {text}
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
