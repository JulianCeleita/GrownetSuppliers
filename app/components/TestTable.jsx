'use client'
// components/Table.js
import React, { useEffect, useRef, useState } from 'react';
import { useTableStore } from '../store/useTableStore';

const TestTable = ({ data, columns }) => {
  const { initialColumns, toggleColumnVisibility } = useTableStore();
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false)
  const menuRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowCheckboxColumn(!showCheckboxColumn)
  };

  const handleCheckboxChange = (columnName) => {
    toggleColumnVisibility(columnName);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowCheckboxColumn(false)
    }
  };
  console.log('initialColumns:', initialColumns)
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => 
                initialColumns.includes(column) &&(
                 <th className='px-4' key={column} onContextMenu={(e) => handleContextMenu(e)}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(
                (column) =>
                  initialColumns.includes(column) && (
                    <td className='px-4' key={column}>{row[column]}</td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showCheckboxColumn === true && (
        <div ref={menuRef} className="absolute bg-white p-2 border rounded">
          <h4 className="font-bold mb-2">Mostrar/Ocultar Columnas</h4>
          {columns.map((column) => (
            <div key={column} className="flex items-center">
              <input
                type="checkbox"
                id={column}
                checked={initialColumns.includes(column)}
                onChange={() => handleCheckboxChange(column)}
              />
              <label htmlFor={column} className="ml-2">
                {column}
              </label>
            </div>
          ))}
          <button className="mt-2" onClick={()=>setShowCheckboxColumn(false)}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default TestTable;
