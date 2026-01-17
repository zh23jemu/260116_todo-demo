import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { TodoProvider } from './contexts/TodoContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Home from './views/Home/index';
import './App.css';

/**
 * 主题包装组件 - 用于根据主题切换Ant Design配置
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} 主题包装组件
 */
const ThemeWrapper = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        // 自定义深色主题颜色
        token: isDarkMode ? {
          // 背景色
          colorBgContainer: '#1f1f1f',
          colorBgElevated: '#2d2d2d',
          colorBgLayout: '#141414',
          colorBgBase: '#1f1f1f',

          // 文字颜色
          colorText: '#ffffff',
          colorTextSecondary: '#b0b0b0',
          colorTextPlaceholder: '#8c8c8c',

          // 边框颜色
          colorBorder: '#3f3f3f',
          colorBorderSecondary: '#2f2f2f',

          // 主色调
          colorPrimary: '#40a9ff',
          colorPrimaryHover: '#69c0ff',
          colorPrimaryActive: '#339af0',

          // 状态颜色
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorInfo: '#1890ff',

          // 阴影
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          boxShadowSecondary: '0 1px 4px rgba(0, 0, 0, 0.2)',

          // 卡片样式
          borderRadius: 8,
          padding: 16,
        } : {
          // 浅色主题保持默认
        },
      }}
    >
      <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        {children}
      </div>
    </ConfigProvider>
  );
};

/**
 * App组件 - 应用入口组件
 * @returns {JSX.Element} App组件
 */
function App() {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <TodoProvider>
          <Home />
        </TodoProvider>
      </ThemeWrapper>
    </ThemeProvider>
  );
}

export default App;
