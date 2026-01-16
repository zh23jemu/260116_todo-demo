// 主题管理Context - 简化版
import React, { createContext, useState, useEffect, useContext } from 'react';

// 创建Context
const ThemeContext = createContext(null);

// 主题类型
const THEME_TYPES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// 存储键名
const STORAGE_KEY = 'todo-app-theme';

/**
 * ThemeProvider组件 - 提供主题管理功能
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} ThemeProvider组件
 */
export const ThemeProvider = ({ children }) => {
  // 状态定义 - 只保留简单的主题切换
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 初始化主题
  useEffect(() => {
    // 从localStorage获取保存的主题偏好
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      setIsDarkMode(savedTheme === THEME_TYPES.DARK);
    }
  }, []);

  /**
   * 切换主题
   * @param {boolean} darkMode - 是否为暗黑模式
   */
  const toggleTheme = (darkMode) => {
    setIsDarkMode(darkMode);
    localStorage.setItem(STORAGE_KEY, darkMode ? THEME_TYPES.DARK : THEME_TYPES.LIGHT);
  };

  // 上下文值
  const contextValue = {
    isDarkMode,
    toggleTheme,
    THEME_TYPES
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 自定义Hook - 用于访问ThemeContext
 * @returns {Object} ThemeContext值
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};