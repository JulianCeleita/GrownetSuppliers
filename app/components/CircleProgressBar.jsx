import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const CircleProgressBar = ({ percentage }) => {

    const [color, setColor] = useState('#FFB7B7')

    useEffect(() => {
        if (percentage <= 49) {
            setColor('#FFB7B7')
        } else if (percentage <= 99) {
            setColor('#FFCA8C')
        } else {
            setColor('#B7FFB7')
        }
    }, [percentage])

    return (
        <div className='flex items-center justify-center w-16 h-16'>
            <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                    textSize: '25px',
                    pathColor: color,
                    textColor: 'black',
                    trailColor: '#d6d6d6',
                    strokeWidth: 20,
                })}
            />
        </div>
    );
};