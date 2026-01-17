// TodoContext - 用于全局状态管理
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  batchDeleteTodos,
  toggleTodoStatus,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  toggleSubtaskStatus,
  getTodoStatistics,
  filterTodos
} from '../services/todoService';
import { getCategories, saveCategories } from '../services/storage';
import { checkReminders } from '../services/reminderService';

// 创建Context
const TodoContext = createContext(null);

/**
 * TodoProvider组件 - 提供全局状态管理
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} TodoProvider组件
 */
export const TodoProvider = ({ children }) => {
  // 状态定义
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: [],
    category: [],
    search: ''
  });
  const [statistics, setStatistics] = useState({
    total: 0,
    done: 0,
    inProgress: 0,
    todo: 0,
    priorityStats: {},
    categoryStats: {},
    completionRate: 0
  });

  // 初始化数据
  useEffect(() => {
    const fetchData = async () => {
      await loadInitialData();
    };
    fetchData();
  }, []);

  // 当todos或filters变化时，更新筛选结果和统计数据
  useEffect(() => {
    const updateData = async () => {
      const filtered = filterTodos(todos, filters);
      setFilteredTodos(filtered);
      await updateStatistics();
    };
    updateData();
  }, [todos, filters]);

  // 初始化提醒服务
  useEffect(() => {
    // 每分钟检查一次提醒
    const interval = setInterval(() => {
      const reminderIds = checkReminders(todos);
      // 标记已提醒的任务
      reminderIds.forEach(id => {
        // 使用updateTodo函数来更新任务状态
        updateTodo(id, { reminded: true });
      });
    }, 60000);

    // 组件卸载时清理
    return () => clearInterval(interval);
  }, [todos, updateTodo]);

  /**
   * 加载初始数据
   */
  const loadInitialData = async () => {
    const loadedTodos = await fetchTodos();
    const loadedCategories = await getCategories();
    setTodos(loadedTodos);
    setCategories(loadedCategories);
  };

  /**
   * 更新统计数据
   */
  const updateStatistics = async () => {
    const stats = await getTodoStatistics();
    setStatistics(stats);
  };

  // 待办事项操作方法

  /**
   * 添加待办事项
   * @param {Object} todoData - 待办事项数据
   */
  const handleAddTodo = async (todoData) => {
    const updatedTodos = await addTodo(todoData);
    setTodos(updatedTodos);
  };

  /**
   * 更新待办事项
   * @param {string} id - 待办事项ID
   * @param {Object} todoData - 更新的数据
   */
  const handleUpdateTodo = async (id, todoData) => {
    const updatedTodos = await updateTodo(id, todoData);
    setTodos(updatedTodos);
  };

  /**
   * 删除待办事项
   * @param {string} id - 待办事项ID
   */
  const handleDeleteTodo = async (id) => {
    const updatedTodos = await deleteTodo(id);
    setTodos(updatedTodos);
  };

  /**
   * 批量删除待办事项
   * @param {Array} ids - 待办事项ID数组
   */
  const handleBatchDeleteTodos = async (ids) => {
    const updatedTodos = await batchDeleteTodos(ids);
    setTodos(updatedTodos);
  };

  /**
   * 切换待办事项状态
   * @param {string} id - 待办事项ID
   * @param {string} status - 新状态
   */
  const handleToggleTodoStatus = async (id, status) => {
    const updatedTodos = await toggleTodoStatus(id, status);
    setTodos(updatedTodos);
  };

  // 子任务操作方法

  /**
   * 添加子任务
   * @param {string} todoId - 父任务ID
   * @param {string} subtaskTitle - 子任务标题
   */
  const handleAddSubtask = async (todoId, subtaskTitle) => {
    const updatedTodos = await addSubtask(todoId, subtaskTitle);
    setTodos(updatedTodos);
  };

  /**
   * 更新子任务
   * @param {string} todoId - 父任务ID
   * @param {string} subtaskId - 子任务ID
   * @param {Object} subtaskData - 子任务数据
   */
  const handleUpdateSubtask = async (todoId, subtaskId, subtaskData) => {
    const updatedTodos = await updateSubtask(todoId, subtaskId, subtaskData);
    setTodos(updatedTodos);
  };

  /**
   * 删除子任务
   * @param {string} todoId - 父任务ID
   * @param {string} subtaskId - 子任务ID
   */
  const handleDeleteSubtask = async (todoId, subtaskId) => {
    const updatedTodos = await deleteSubtask(todoId, subtaskId);
    setTodos(updatedTodos);
  };

  /**
   * 切换子任务状态
   * @param {string} todoId - 父任务ID
   * @param {string} subtaskId - 子任务ID
   * @param {string} status - 新状态
   */
  const handleToggleSubtaskStatus = async (todoId, subtaskId, status) => {
    const updatedTodos = await toggleSubtaskStatus(todoId, subtaskId, status);
    setTodos(updatedTodos);
  };

  // 分类操作方法

  /**
   * 添加分类
   * @param {Object} categoryData - 分类数据
   */
  const handleAddCategory = (categoryData) => {
    const newCategory = {
      id: Date.now().toString(36),
      name: categoryData.name,
      color: categoryData.color || '#1890ff'
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  };

  /**
   * 更新分类
   * @param {string} id - 分类ID
   * @param {Object} categoryData - 更新的数据
   */
  const handleUpdateCategory = (id, categoryData) => {
    const updatedCategories = categories.map(category => {
      if (category.id === id) {
        return {
          ...category,
          ...categoryData
        };
      }
      return category;
    });
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  };

  /**
   * 删除分类
   * @param {string} id - 分类ID
   */
  const handleDeleteCategory = (id) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    saveCategories(updatedCategories);

    // 将使用该分类的待办事项分类清空
    const updatedTodos = todos.map(todo => {
      if (todo.category === id) {
        return {
          ...todo,
          category: ''
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    // 保存更新后的待办事项
    localStorage.setItem('todo-app-todos', JSON.stringify(updatedTodos));
  };

  // 筛选操作方法

  /**
   * 更新筛选条件
   * @param {Object} newFilters - 新的筛选条件
   */
  const handleUpdateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  /**
   * 重置筛选条件
   */
  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      priority: [],
      category: [],
      search: ''
    });
  };

  // 上下文值
  const contextValue = {
    // 状态
    todos,
    filteredTodos,
    categories,
    filters,
    statistics,

    // 待办事项操作
    addTodo: handleAddTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
    batchDeleteTodos: handleBatchDeleteTodos,
    toggleTodoStatus: handleToggleTodoStatus,

    // 子任务操作
    addSubtask: handleAddSubtask,
    updateSubtask: handleUpdateSubtask,
    deleteSubtask: handleDeleteSubtask,
    toggleSubtaskStatus: handleToggleSubtaskStatus,

    // 分类操作
    addCategory: handleAddCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,

    // 筛选操作
    updateFilters: handleUpdateFilters,
    resetFilters: handleResetFilters
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

/**
 * 自定义Hook - 用于访问TodoContext
 * @returns {Object} TodoContext值
 */
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};