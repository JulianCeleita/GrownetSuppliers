import React from 'react';

const Spinner = ({ size = 30 }) => {
    const borderSize = size / 7.5; // Ajusta la proporción aquí

    return (

        <div className="spinner">
            <style jsx>{`
          .spinner {
            border: ${borderSize}px solid #f3f3f3;
            border-top: ${borderSize}px solid #3498db;
            border-radius: 50%;
            width: ${size}px;
            height: ${size}px;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </div>

    );
};

export default Spinner;