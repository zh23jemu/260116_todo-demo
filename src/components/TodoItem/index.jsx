// 待办事项项组件
import React, { useState } from 'react';
import { Card, Button, Tag, Space, Popconfirm, Dropdown, Menu, Modal, Form, Input, DatePicker, Select, Collapse, List } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useTodo } from '../../contexts/TodoContext';
import { formatDate, getDateDescription } from '../../utils/dateUtils';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

/**
 * TodoItem组件 - 用于显示单个待办事项
 * @param {Object} props - 组件属性
 * @param {Object} props.todo - 待办事项数据
 * @returns {JSX.Element} TodoItem组件
 */
const TodoItem = ({ todo }) => {
  const { updateTodo, deleteTodo, toggleTodoStatus, addSubtask, deleteSubtask, toggleSubtaskStatus, categories } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [form] = Form.useForm();
  const [subtaskForm] = Form.useForm();

  // 计算子任务完成进度
  const subtaskProgress = todo.subtasks && todo.subtasks.length > 0
    ? Math.round((todo.subtasks.filter(st => st.status === 'done').length / todo.subtasks.length) * 100)
    : 0;

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



  /**
   * 处理编辑按钮点击
   */
  const handleEdit = () => {
    // 打开编辑模态框，表单数据通过initialValues初始化
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
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      reminderTime: values.reminderTime ? values.reminderTime.toISOString() : null
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

  /**
   * 处理添加子任务
   * @param {Object} values - 表单值
   */
  const handleAddSubtask = (values) => {
    addSubtask(todo.id, values.title);
    setIsAddingSubtask(false);
    subtaskForm.resetFields();
  };

  /**
   * 处理删除子任务
   * @param {string} subtaskId - 子任务ID
   */
  const handleDeleteSubtask = (subtaskId) => {
    deleteSubtask(todo.id, subtaskId);
  };

  /**
   * 处理子任务状态切换
   * @param {string} subtaskId - 子任务ID
   * @param {string} status - 新状态
   */
  const handleSubtaskStatusChange = (subtaskId, status) => {
    toggleSubtaskStatus(todo.id, subtaskId, status);
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
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'edit',
                    label: '编辑',
                    icon: <EditOutlined />,
                    onClick: handleEdit
                  },
                  {
                    key: 'delete',
                    label: '删除',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: handleDelete
                  }
                ]
              }}
              trigger={['click']}
            >
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

          {/* 标签 */}
          {todo.tags && todo.tags.length > 0 && (
            <Space wrap style={{ margin: '8px 0' }}>
              {todo.tags.map((tag, index) => (
                <Tag key={index} color="blue" style={{ margin: '2px 0' }}>
                  {tag}
                </Tag>
              ))}
            </Space>
          )}

          {/* 描述 */}
          {todo.description && (
            <p style={{
              margin: '8px 0',
              opacity: 0.85,
              textDecoration: todo.status === 'done' ? 'line-through' : 'none'
            }}>
              {todo.description}
            </p>
          )}

          {/* 底部信息 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.65, fontSize: '12px' }}>
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

          {/* 子任务区域 */}
          {todo.subtasks && todo.subtasks.length > 0 && (
            <Collapse
              ghost
              size="small"
              style={{ marginTop: 12 }}
              defaultActiveKey={[]}
              items={[
                {
                  key: 'subtasks',
                  label: (
                    <span style={{ fontSize: '13px' }}>
                      子任务 ({todo.subtasks.filter(st => st.status === 'done').length}/{todo.subtasks.length})
                      {subtaskProgress > 0 && (
                        <Tag color={subtaskProgress === 100 ? 'green' : 'blue'} style={{ marginLeft: 8 }}>
                          {subtaskProgress}%
                        </Tag>
                      )}
                    </span>
                  ),
                  children: (
                    <List
                      size="small"
                      dataSource={todo.subtasks}
                      renderItem={(subtask) => (
                        <List.Item
                          key={subtask.id}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 4,
                            margin: '4px 0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: subtask.status === 'done' ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
                          }}
                        >
                          <Space size="small">
                            {/* 子任务复选框 */}
                            <Button
                              type="text"
                              icon={subtask.status === 'done' ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CloseOutlined style={{ color: '#d9d9d9' }} />}
                              onClick={() => handleSubtaskStatusChange(subtask.id, subtask.status === 'done' ? 'todo' : 'done')}
                              size="small"
                              style={{ padding: '0 4px' }}
                            />
                            <span style={{
                              textDecoration: subtask.status === 'done' ? 'line-through' : 'none',
                              opacity: subtask.status === 'done' ? 0.6 : 1
                            }}>
                              {subtask.title}
                            </span>
                          </Space>
                          <Popconfirm
                            title="确认删除此子任务？"
                            onConfirm={() => handleDeleteSubtask(subtask.id)}
                            okText="确认"
                            cancelText="取消"
                          >
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              size="small"
                              style={{ padding: '0 4px' }}
                            />
                          </Popconfirm>
                        </List.Item>
                      )}
                    />
                  )
                }
              ]}
            />
          )}

          {/* 添加子任务按钮 */}
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => setIsAddingSubtask(true)}
            size="small"
            style={{ marginTop: 8 }}
          >
            添加子任务
          </Button>
        </Space>
      </Card>

      {/* 添加子任务模态框 */}
      <Modal
        title="添加子任务"
        open={isAddingSubtask}
        onCancel={() => setIsAddingSubtask(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={subtaskForm}
          layout="vertical"
          onFinish={handleAddSubtask}
        >
          <Form.Item
            name="title"
            label="子任务标题"
            rules={[{ required: true, message: '请输入子任务标题' }]}
          >
            <Input placeholder="请输入子任务标题" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsAddingSubtask(false)}>取消</Button>
              <Button type="primary" htmlType="submit">添加</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑模态框 */}
      <Modal
        title="编辑待办事项"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          initialValues={{
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
            reminderTime: todo.reminderTime ? new Date(todo.reminderTime) : null,
            priority: todo.priority,
            category: todo.category,
            tags: todo.tags || []
          }}
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
            name="reminderTime"
            label="提醒时间"
          >
            <DatePicker showTime style={{ width: '100%' }} placeholder="请选择提醒时间" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
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

          <Form.Item
            name="tags"
            label="标签"
            rules={[{ type: 'array', message: '请输入标签' }]}
          >
            <Select
              mode="tags"
              placeholder="请输入标签，按回车确认"
              style={{ width: '100%' }}
              tokenSeparators={[',', '，', ';', '；', ' ']}
            >
              {/* 可以添加常用标签作为选项 */}
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