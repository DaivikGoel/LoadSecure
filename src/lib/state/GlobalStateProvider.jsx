import React, { createContext, useState, useContext } from 'react';

const defaultTheme = {
  focusOutline: 'focus:outline-primary-500',
  textColor: 'text-primary-600',
  textColorDark: 'text-primary-900',
  backgroundColorDark: 'bg-primary-600',
  backgroundColorLight: 'bg-primary-50',
  borderColor: 'border-primary-100',
  borderColorDark: 'border-primary-600',
  borderCheckedDark: 'data-[state=checked]:border-primary-600',
  ringCheckedDark: 'data-[state=checked]:ring-primary-600',
  softButton: 'bg-primary-500 hover:bg-primary-400',
  normalButton: 'bg-primary-500 disabled:bg-primary-500/50',
  bgGroupHoverDark: 'group-hover:bg-primary-800',
  inputFocusRing: 'focus:ring-primary-500',
  bgHoverLight: 'hover:bg-primary-50',
  bgDataHighlightedLight: 'data-[highlighted]:bg-primary-50',
  datePickerOpenRing: 'ring-primary-500 ring-2',
  primaryColorHex: '#EDEDED',
  productBadge: 'text-indigo-700 ring-indigo-700/10',
};

const GlobalStateContext = createContext(null);

export const GlobalStateProvider = ({ children }) => {

  const [currentCreator, setCurrentCreator] = useState(null);
  const [currentCreatorURL, setCurrentCreatorURL] = useState(null);
  const [currentCreatorPlatform, setCurrentCreatorPlatform] = useState(null)
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businessCreators, setBusinessCreators] = useState(null);

  return (
    <GlobalStateContext.Provider value={{ 
      currentCreator, 
      setCurrentCreator, 
      selectedBusiness, 
      setSelectedBusiness, 
      businessCreators, 
      setBusinessCreators,
      currentCreatorURL,
      setCurrentCreatorURL,
      currentCreatorPlatform,
      setCurrentCreatorPlatform,
      theme: defaultTheme
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);

export const useThemeConfig = () => {
  const { theme } = useGlobalState();
  return theme;
};

export const useThemeTextColor = () => useThemeConfig().textColor;
export const useThemeBorderColor = () => useThemeConfig().borderColor;
export const useThemeBorderColorDark = () => useThemeConfig().borderColorDark;
export const useThemeFocusOutline = () => useThemeConfig().focusOutline;
export const useThemeRingCheckedDark = () => useThemeConfig().ringCheckedDark;
export const useThemeBorderCheckedDark = () => useThemeConfig().borderCheckedDark;
export const useThemeBackgroundLight = () => useThemeConfig().backgroundColorLight;