// 主题切换组件 - 简化版
import React from 'react';
import { Switch, Space, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * ThemeSwitcher组件 - 用于切换深色/浅色主题
 * @returns {JSX.Element} ThemeSwitcher组件
 */
const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  /**
   * 处理开关切换
   * @param {boolean} checked - 是否为暗黑模式
   */
  const handleSwitchChange = (checked) => {
    toggleTheme(checked);
  };

  return (
    <Space>
      <Tooltip title="浅色模式">
        <BulbOutlined style={{ fontSize: 18 }} />
      </Tooltip>
      <Switch
        checked={isDarkMode}
        onChange={handleSwitchChange}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
      />
      <Tooltip title="深色模式">
        <BulbFilled style={{ fontSize: 18, color: '#faad14' }} />
      </Tooltip>
    </Space>
  );
};

export default ThemeSwitcher;