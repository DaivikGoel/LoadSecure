import React, { useState, useEffect, useRef } from 'react';
import './MultiSelectInput.css';

const MultiSelectInput = ({
  label,
  options,
  onChange,
  initialSelectedValues = [],
  placeholder = 'Select options',
  isInvalid = false,
  errorMessage,
  name,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialSelectedValues.length > 0) {
      setSelectedItems(options.filter(option => initialSelectedValues.includes(option.value)));
    }
  }, [initialSelectedValues, options]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleOptionClick = (option) => {
    if (!selectedItems.some(item => item.value === option.value)) {
      const updatedItems = [...selectedItems, option];
      setSelectedItems(updatedItems);
      onChange && onChange(updatedItems.map(item => item.value));
    }
    setInputValue('');
    setIsDropdownOpen(false);
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedItems = selectedItems.filter(item => item.value !== itemToRemove.value);
    setSelectedItems(updatedItems);
    onChange && onChange(updatedItems.map(item => item.value));
  };

  const filteredOptions = options.filter(option => 
    !selectedItems.some(item => item.value === option.value) &&
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="multi-select-container">
      {label && <label className="multi-select-label">{label}</label>}
      <div className={`multi-select-input ${isInvalid ? 'invalid' : ''}`}>
        <div className="selected-items">
          {selectedItems.map(item => (
            <span key={item.value} className="selected-item">
              {item.icon}
              {item.label}
              <button onClick={() => handleRemoveItem(item)}>&times;</button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            placeholder={selectedItems.length === 0 ? placeholder : ''}
          />
        </div>
        {isDropdownOpen && filteredOptions.length > 0 && (
          <ul className="options-dropdown">
            {filteredOptions.map(option => (
              <li key={option.value} onMouseDown={() => handleOptionClick(option)}>
                {option.icon}
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isInvalid && errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default MultiSelectInput;