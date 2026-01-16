// 筛选面板组件
import React from 'react';
import { Card, Radio, Checkbox, Button, Space, Divider } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useTodo } from '../../contexts/TodoContext';

/**
 * FilterPanel组件 - 用于筛选待办事项
 * @returns {JSX.Element} FilterPanel组件
 */
const FilterPanel = () => {
  const { filters, updateFilters, resetFilters, categories } = useTodo();

  // 优先级选项
  const priorityOptions = [
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' },
    { label: '低', value: 'low' }
  ];

  // 状态选项
  const statusOptions = [
    { label: '全部', value: 'all' },
    { label: '待办', value: 'todo' },
    { label: '进行中', value: 'in-progress' },
    { label: '已完成', value: 'done' }
  ];

  /**
   * 处理状态筛选变化
   * @param {Object} e - 事件对象
   */
  const handleStatusChange = (e) => {
    updateFilters({ status: e.target.value });
  };

  /**
   * 处理优先级筛选变化
   * @param {Array} values - 选中的优先级值
   */
  const handlePriorityChange = (values) => {
    updateFilters({ priority: values });
  };

  /**
   * 处理分类筛选变化
   * @param {Array} values - 选中的分类值
   */
  const handleCategoryChange = (values) => {
    updateFilters({ category: values });
  };

  /**
   * 重置所有筛选条件
   */
  const handleReset = () => {
    resetFilters();
  };

  return (
    <Card
      title={<Space><FilterOutlined />筛选条件</Space>}
      size="small"
      style={{ marginBottom: 16 }}
    >
      {/* 状态筛选 */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ marginBottom: 8 }}>状态</h4>
        <Radio.Group
          value={filters.status}
          onChange={handleStatusChange}
          style={{ width: '100%', display: 'flex', flexWrap: 'nowrap' }}
        >
          {statusOptions.map(option => (
            <Radio.Button
              key={option.value}
              value={option.value}
              style={{
                flex: 1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                padding: '4px 8px',
                fontSize: '13px'
              }}
            >
              {option.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 优先级筛选 */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ marginBottom: 8 }}>优先级</h4>
        <Checkbox.Group
          options={priorityOptions}
          value={filters.priority}
          onChange={handlePriorityChange}
        />
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 分类筛选 */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ marginBottom: 8 }}>分类</h4>
        <Checkbox.Group
          options={categories.map(category => ({
            label: category.name,
            value: category.id
          }))}
          value={filters.category}
          onChange={handleCategoryChange}
        />
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 重置按钮 */}
      <Button
        type="text"
        icon={<ClearOutlined />}
        onClick={handleReset}
        block
      >
        重置筛选
      </Button>
    </Card>
  );
};

export default FilterPanel;