// 待办事项项组件
import React, { useState } from 'react';
import { Card, Button, Tag, Space, Popconfirm, Dropdown, Menu, Modal, Form, Input, DatePicker, Select } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTodo } from '../../contexts/TodoContext';
import { formatDate, getDateDescription } from '../../utils/dateUtils';

const { TextArea } = Input;
const { Option } = Select;

/**
 * TodoItem组件 - 用于显示单个待办事项
 * @param {Object} props - 组件属性
 * @param {Object} props.todo - 待办事项数据
 * @returns {JSX.Element} TodoItem组件
 */
const TodoItem = ({ todo }) => {
  const { updateTodo, deleteTodo, toggleTodoStatus, categories } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // 根据优先级获取对应的样式
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return { color: '#ff4d4f', borderColor: '#ff4d4f' };
      case 'medium':
        return { color: '#faad14', borderColor: '#faad14' };
      case 'low':
        return { color: '#52c41a', borderColor: '#52c41a' };
      default:
        return {};
    }
  };

  // 根据状态获取对应的样式
  const getStatusStyle = (status) => {
    switch (status) {
      case 'todo':
        return { color: '#1890ff', borderColor: '#1890ff' };
      case 'in-progress':
        return { color: '#faad14', borderColor: '#faad14' };
      case 'done':
        return { color: '#52c41a', borderColor: '#52c41a' };
      default:
        return {};
    }
  };

  // 获取分类名称
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  // 获取分类颜色
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#d9d9d9';
  };

  // 编辑菜单选项
  const menu = (
    <Menu
      onClick={(e) => {
        if (e.key === 'edit') {
          handleEdit();
        } else if (e.key === 'delete') {
          handleDelete();
        }
      }}
    >
      <Menu.Item key="edit" icon={<EditOutlined />}>
        编辑
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        删除
      </Menu.Item>
    </Menu>
  );

  /**
   * 处理编辑按钮点击
   */
  const handleEdit = () => {
    // 初始化表单数据
    form.setFieldsValue({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
      priority: todo.priority,
      category: todo.category
    });
    setIsEditing(true);
  };

  /**
   * 处理删除按钮点击
   */
  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  /**
   * 处理编辑提交
   * @param {Object} values - 表单值
   */
  const handleEditSubmit = (values) => {
    updateTodo(todo.id, {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null
    });
    setIsEditing(false);
  };

  /**
   * 处理状态切换
   * @param {string} status - 新状态
   */
  const handleStatusChange = (status) => {
    toggleTodoStatus(todo.id, status);
  };

  return (
    <>
      <Card
        key={todo.id}
        size="small"
        style={{
          marginBottom: 12,
          opacity: todo.status === 'done' ? 0.7 : 1
        }}
        extra={
          <Space>
            {/* 状态切换按钮 */}
            {todo.status === 'todo' && (
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleStatusChange('in-progress')}
                size="small"
              >
                开始
              </Button>
            )}
            {todo.status === 'in-progress' && (
              <>
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={() => handleStatusChange('done')}
                  size="small"
                  style={{ color: '#52c41a' }}
                >
                  完成
                </Button>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => handleStatusChange('todo')}
                  size="small"
                >
                  取消
                </Button>
              </>
            )}
            {todo.status === 'done' && (
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleStatusChange('todo')}
                size="small"
              >
                重新打开
              </Button>
            )}
            
            {/* 更多操作 */}
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                type="text"
                icon={<MoreOutlined />}
                size="small"
              />
            </Dropdown>
          </Space>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {/* 标题 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{
              margin: 0,
              textDecoration: todo.status === 'done' ? 'line-through' : 'none'
            }}>
              {todo.title}
            </h4>
            <Space>
              {/* 优先级标签 */}
              <Tag style={getPriorityStyle(todo.priority)}>
                {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
              </Tag>
              {/* 状态标签 */}
              <Tag style={getStatusStyle(todo.status)}>
                {todo.status === 'todo' ? '待办' : todo.status === 'in-progress' ? '进行中' : '已完成'}
              </Tag>
              {/* 分类标签 */}
              {todo.category && (
                <Tag color={getCategoryColor(todo.category)}>
                  {getCategoryName(todo.category)}
                </Tag>
              )}
            </Space>
          </div>

          {/* 描述 */}
          {todo.description && (
            <p style={{
              margin: '8px 0',
              color: '#666',
              textDecoration: todo.status === 'done' ? 'line-through' : 'none'
            }}>
              {todo.description}
            </p>
          )}

          {/* 底部信息 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#999', fontSize: '12px' }}>
            {/* 截止日期 */}
            {todo.dueDate && (
              <span>
                截止: {getDateDescription(todo.dueDate)} ({formatDate(todo.dueDate)})
              </span>
            )}
            {/* 创建时间 */}
            <span>
              创建: {formatDate(todo.createdAt, 'YYYY-MM-DD')}
            </span>
          </div>
        </Space>
      </Card>

      {/* 编辑模态框 */}
      <Modal
        title="编辑待办事项"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="截止日期"
          >
            <DatePicker showTime style={{ width: '100%' }} placeholder="请选择截止日期" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            initialValue="medium"
          >
            <Select placeholder="请选择优先级">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
          >
            <Select placeholder="请选择分类" allowClear>
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsEditing(false)}>取消</Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TodoItem;