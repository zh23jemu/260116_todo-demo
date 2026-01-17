// 同步开关组件 - 用于启用/禁用Firebase同步
import React from 'react';
import { Switch, Space, Tooltip } from 'antd';
import { CloudOutlined, CloudFilled } from '@ant-design/icons';
import { isSyncEnabled, setSyncEnabled } from '../../services/storage';

/**
 * SyncSwitcher组件 - 用于启用/禁用Firebase同步
 * @returns {JSX.Element} SyncSwitcher组件
 */
const SyncSwitcher = () => {
  // 初始状态从本地存储获取
  const [enabled, setEnabled] = React.useState(isSyncEnabled());

  /**
   * 处理开关切换
   * @param {boolean} checked - 是否启用同步
   */
  const handleSwitchChange = (checked) => {
    setEnabled(checked);
    setSyncEnabled(checked);
    // 提示用户同步状态已更改
    console.log(`Firebase同步已${checked ? '启用' : '禁用'}`);
  };

  return (
    <Space>
      <Tooltip title="禁用云同步">
        <CloudOutlined style={{ fontSize: 18 }} />
      </Tooltip>
      <Switch
        checked={enabled}
        onChange={handleSwitchChange}
        checkedChildren="☁️"
        unCheckedChildren="💾"
      />
      <Tooltip title="启用云同步">
        <CloudFilled style={{ fontSize: 18, color: '#1890ff' }} />
      </Tooltip>
    </Space>
  );
};

export default SyncSwitcher;
