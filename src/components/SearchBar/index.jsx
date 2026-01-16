// 搜索栏组件
import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTodo } from '../../contexts/TodoContext';

const { Search } = Input;

/**
 * SearchBar组件 - 用于待办事项搜索
 * @returns {JSX.Element} SearchBar组件
 */
const SearchBar = () => {
  const { filters, updateFilters } = useTodo();

  /**
   * 处理搜索输入变化
   * @param {string} value - 搜索关键词
   */
  const handleSearch = (value) => {
    updateFilters({ search: value });
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Search
        placeholder="搜索待办事项..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        value={filters.search}
        onChange={(e) => handleSearch(e.target.value)}
        onSearch={handleSearch}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default SearchBar;