import React from 'react';
import { CircleFlag } from 'react-circle-flags';
import countries from '../../../assets/countries.json';
import MultiSelectInput from '../design-system/MultiSelectInput';
import './CountrySelectInput.css';

const topCountries = [
  'US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU', 'IT', 'BR', 'IN',
];

const options = countries.map((country) => ({
  value: country.code,
  label: country.name,
  icon: (
    <CircleFlag
      countryCode={country.code.toLowerCase()}
      height={25}
      width={25}
      className="drop-shadow-sm"
    />
  ),
}));

// Sort options to have top countries first
const sortedOptions = options.sort((a, b) => {
  const indexA = topCountries.indexOf(a.value);
  const indexB = topCountries.indexOf(b.value);
  if (indexA !== -1 && indexB === -1) {
    return -1;
  } else if (indexA === -1 && indexB !== -1) {
    return 1;
  } else {
    return indexA - indexB;
  }
});

const CountrySelectInput = ({ 
  label,
  onChange,
  initialSelectedValues,
  placeholder = 'Select countries',
  isInvalid = false,
  errorMessage,
  countryList,
  ...props
}) => {
  const filteredOptions = countryList
    ? sortedOptions.filter((o) => countryList.includes(o.value))
    : sortedOptions;

  return (
    <MultiSelectInput
      label={label}
      options={filteredOptions}
      onChange={onChange}
      initialSelectedValues={initialSelectedValues}
      placeholder={placeholder}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      {...props}
    />
  );
};

export default CountrySelectInput;