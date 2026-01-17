// 待办事项列表组件
import React, { useState } from 'react';
import { Button, Space, Modal, Form, Input, DatePicker, Select, Empty, List } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTodo } from '../../contexts/TodoContext';
import TodoItem from '../TodoItem';

const { TextArea } = Input;
const { Option } = Select;

/**
 * TodoList组件 - 用于显示待办事项列表
 * @returns {JSX.Element} TodoList组件
 */
const TodoList = () => {
  const { filteredTodos, addTodo, categories } = useTodo();
  const [isAdding, setIsAdding] = useState(false);
  const [form] = Form.useForm();

  /**
   * 处理添加按钮点击
   */
  const handleAddClick = () => {
    setIsAdding(true);
  };

  /**
   * 处理添加提交
   * @param {Object} values - 表单值
   */
  const handleAddSubmit = (values) => {
    addTodo({
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      reminderTime: values.reminderTime ? values.reminderTime.toISOString() : null
    });
    setIsAdding(false);
    form.resetFields();
  };

  return (
    <div>
      {/* 添加按钮 */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddClick}
          size="large"
        >
          添加待办事项
        </Button>
      </div>

      {/* 待办事项列表 */}
      {filteredTodos.length > 0 ? (
        filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))
      ) : (
        <Empty description="暂无待办事项" style={{ margin: '40px 0' }} />
      )}

      {/* 添加模态框 */}
      <Modal
        title="添加待办事项"
        open={isAdding}
        onCancel={() => setIsAdding(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddSubmit}
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

          <Form.Item
            name="reminderTime"
            label="提醒时间"
          >
            <DatePicker showTime style={{ width: '100%' }} placeholder="请选择提醒时间" />
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

          {/* 子任务列表 */}
          <Form.List
            name="subtasks"
            label="子任务"
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      fieldKey={[fieldKey, 'title']}
                      rules={[{ required: true, message: '请输入子任务标题' }]}
                    >
                      <Input placeholder="请输入子任务标题" />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加子任务
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsAdding(false)}>取消</Button>
              <Button type="primary" htmlType="submit">添加</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoList;