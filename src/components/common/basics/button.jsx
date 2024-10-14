import React from 'react';
import './Button.css'; // We'll create this CSS file for styles

const Button = ({
  children,
  variant = 'normal',
  colorScheme = 'theme',
  size = 'md',
  onClick,
  type = 'button',
  isDisabled = false,
  isLoading = false,
  icon,
  className,
  id,
}) => {
  const getButtonClass = () => {
    let baseClass = 'button';
    baseClass += ` ${variant}`;
    baseClass += ` ${colorScheme}`;
    baseClass += ` ${size}`;
    if (isDisabled) baseClass += ' disabled';
    if (isLoading) baseClass += ' loading';
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  const LoadingIcon = () => (
    <svg className="loading-icon" viewBox="0 0 24 24">
      <circle className="loading-circle" cx="12" cy="12" r="10" />
      <path className="loading-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  if (variant === 'link') {
    return (
      <a
        className={getButtonClass()}
        onClick={onClick}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type}
      className={getButtonClass()}
      onClick={onClick}
      disabled={isDisabled || isLoading}
    >
      {isLoading && <LoadingIcon />}
      {icon}
      <span className="button-text">{children}</span>
    </button>
  );
};

export default Button;