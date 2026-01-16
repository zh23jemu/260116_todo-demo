// 统计卡片组件
import React from 'react';
import { Card, Statistic, Row, Col, Progress } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useTodo } from '../../contexts/TodoContext';

/**
 * StatCard组件 - 用于显示待办事项统计信息
 * @returns {JSX.Element} StatCard组件
 */
const StatCard = () => {
  const { statistics } = useTodo();

  return (
    <div style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        {/* 总数量 */}
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="总数量"
              value={statistics.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>

        {/* 待办数量 */}
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="待办"
              value={statistics.todo}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        {/* 进行中数量 */}
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="进行中"
              value={statistics.inProgress}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        {/* 已完成数量 */}
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="已完成"
              value={statistics.done}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 完成率 */}
      <Card size="small" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ marginBottom: 8 }}>完成率</h4>
            <Progress
              type="circle"
              percent={statistics.completionRate}
              size={80}
              format={(percent) => `${percent}%`}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '8px 0' }}>
              <strong>高优先级:</strong> {statistics.priorityStats.high || 0}
            </p>
            <p style={{ margin: '8px 0' }}>
              <strong>中优先级:</strong> {statistics.priorityStats.medium || 0}
            </p>
            <p style={{ margin: '8px 0' }}>
              <strong>低优先级:</strong> {statistics.priorityStats.low || 0}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatCard;