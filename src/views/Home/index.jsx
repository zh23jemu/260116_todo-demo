// 首页组件
import React from 'react';
import { Row, Col } from 'antd';
import SearchBar from '../../components/SearchBar';
import FilterPanel from '../../components/FilterPanel';
import StatCard from '../../components/StatCard';
import TodoList from '../../components/TodoList';
import ThemeSwitcher from '../../components/ThemeSwitcher';

/**
 * Home组件 - 首页，整合所有核心功能
 * @returns {JSX.Element} Home组件
 */
const Home = () => {
  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>待办事项</h1>
        <ThemeSwitcher />
      </div>

      {/* 统计卡片 */}
      <StatCard />

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 左侧：筛选面板 */}
        <Col xs={24} sm={24} md={10} lg={8} xl={7}>
          <FilterPanel />
        </Col>

        {/* 右侧：搜索栏和待办列表 */}
        <Col xs={24} sm={24} md={14} lg={16} xl={17}>
          <SearchBar />
          <TodoList />
        </Col>
      </Row>
    </div>
  );
};

export default Home;