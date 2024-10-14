import React from 'react';
import './TextInput.css';


export default function TextInput({
  isInvalid = false,
  className = '',
  label,
  name,
  type,
  value,
  placeholder,
  errorMessage,
  size = 'sm',
  leftIcon,
  onChange,
  rightIcon,
  onFocus,
  onBlur,
  containerClassName = '',
  disabled = false,
  rows = 3,
}) {
  const inputClasses = `text-input ${size} ${isInvalid ? 'invalid' : ''} ${disabled ? 'disabled' : ''} ${className}`;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          id={'input' + name}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          rows={rows}
        />
      );
    } else {
      return (
        <input
          type={type}
          name={name}
          id={'input' + name}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
        />
      );
    }
  };

  return (
    <div className={`text-input-container ${containerClassName}`}>
      <label htmlFor={name} className="text-input-label">
        {label}
      </label>
      <div className={`text-input-wrapper ${label === '' ? 'no-label' : ''}`}>
        {leftIcon && (
          <div className="text-input-icon left">{leftIcon}</div>
        )}
        {renderInput()}
        {isInvalid && (
          <div className="text-input-icon right error">
            <svg className="exclamation-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {rightIcon && !isInvalid && (
          <div className="text-input-icon right">{rightIcon}</div>
        )}
      </div>
      {isInvalid && (
        <p className="text-input-error">{errorMessage}</p>
      )}
    </div>
  );
}