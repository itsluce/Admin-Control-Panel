import React, { useState, useEffect } from "react";

interface Props {
    value: number;
}

export const NumberWidgetCounter: React.FC<Props> = ({
                                                         value,
                                                     }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 800;
        const steps = 20;
        const stepSize = Math.ceil(value / steps);
        const intervalTime = duration / steps;

        const interval = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount < value) {
                    const increment = Math.min(stepSize, value - prevCount);
                    return prevCount + increment;
                } else if (prevCount > value) {
                    const decrement = Math.min(stepSize, prevCount - value);
                    return prevCount - decrement;
                } else {
                    clearInterval(interval);
                    return prevCount;
                }
            });
        }, intervalTime);

        return () => clearInterval(interval);
    }, [value]);

    return <div>{Math.round(count)}</div>;
};
