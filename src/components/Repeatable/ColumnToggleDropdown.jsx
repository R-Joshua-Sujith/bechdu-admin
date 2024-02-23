import React, { useEffect, useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./ColumnToggleDropdown.css";

const ColumnToggleDropdown = ({
  tableName, // Unique identifier for the table
  columns,
  visibleColumns,
  setVisibleColumns,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleCheckboxChange = (fieldName) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  // Load saved column visibility from localStorage on component mount
  useEffect(() => {
    const savedColumns = localStorage.getItem(tableName);
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, [tableName, setVisibleColumns]);

  // Save column visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(tableName, JSON.stringify(visibleColumns));
  }, [tableName, visibleColumns]); // Added visibleColumns as a dependency

  return (
    <div className="column-toggle">
      <label onClick={toggleDropdown}>
        Toggle Columns{" "}
        {isDropdownVisible ? (
          <KeyboardArrowUpIcon className="icons" />
        ) : (
          <KeyboardArrowDownIcon className="icons" />
        )}
      </label>
      {isDropdownVisible && (
        <div className="dropdown-checkbox-container">
          {columns
            .filter((column) => column.field !== "actions") // Exclude "Actions" column
            .map((column) => (
              <div key={column.field} className="column-toggle-option">
                <input
                  type="checkbox"
                  checked={visibleColumns[column.field]}
                  onChange={() => handleCheckboxChange(column.field)}
                />
                <label>{column.headerName}</label>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ColumnToggleDropdown;
