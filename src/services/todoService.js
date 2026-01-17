// 待办事项业务逻辑服务
import { getTodos, saveTodos } from './storage';

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 获取当前时间的ISO字符串
 * @returns {string} ISO格式的当前时间
 */
const getCurrentTime = () => {
  return new Date().toISOString();
};

/**
 * 获取所有待办事项
 * @returns {Array} 待办事项列表
 */
export const fetchTodos = () => {
  return getTodos();
};

/**
 * 添加待办事项
 * @param {Object} todoData - 待办事项数据
 * @returns {Array} 更新后的待办事项列表
 */
export const addTodo = (todoData) => {
  const todos = getTodos();
  const newTodo = {
    id: generateId(),
    title: todoData.title,
    description: todoData.description || '',
    dueDate: todoData.dueDate || null,
    priority: todoData.priority || 'medium',
    category: todoData.category || '',
    tags: todoData.tags || [],
    subtasks: todoData.subtasks || [],
    status: 'todo',
    createdAt: getCurrentTime(),
    updatedAt: getCurrentTime()
  };

  const updatedTodos = [...todos, newTodo];
  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * 更新待办事项
 * @param {string} id - 待办事项ID
 * @param {Object} todoData - 更新的数据
 * @returns {Array} 更新后的待办事项列表
 */
export const updateTodo = (id, todoData) => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        ...todoData,
        updatedAt: getCurrentTime()
      };
    }
    return todo;
  });

  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * 删除待办事项
 * @param {string} id - 待办事项ID
 * @returns {Array} 更新后的待办事项列表
 */
export const deleteTodo = (id) => {
  const todos = getTodos();
  const updatedTodos = todos.filter(todo => todo.id !== id);
  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * 批量删除待办事项
 * @param {Array} ids - 待办事项ID数组
 * @returns {Array} 更新后的待办事项列表
 */
export const batchDeleteTodos = (ids) => {
  const todos = getTodos();
  const updatedTodos = todos.filter(todo => !ids.includes(todo.id));
  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * 切换待办事项状态
 * @param {string} id - 待办事项ID
 * @param {string} status - 新状态
 * @returns {Array} 更新后的待办事项列表
 */
export const toggleTodoStatus = (id, status) => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        status,
        updatedAt: getCurrentTime()
      };
    }
    return todo;
  });

  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * 添加子任务
 * @param {string} todoId - 父任务ID
 * @param {string} subtaskTitle - 子任务标题
 * @returns {Array} 更新后的待办事项列表
 */
export const addSubtask = (todoId, subtaskTitle) => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => {
    if (todo.id === todoId) {
      const newSubtask = {
        id: generateId(),
        title: subtaskTitle,
        status: 'todo',
        createdAt: getCurrentTime(),
        updatedAt: getCurrentTime()
      };
      return {
        ...todo,
        subtasks: [...(todo.subtasks || []), newSubtask],
        updatedAt: getCurrentTime()
      };
    }
    return todo;
  });

  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * 更新子任务
 * @param {string} todoId - 父任务ID
 * @param {string} subtaskId - 子任务ID
 * @param {Object} subtaskData - 子任务数据
 * @returns {Array} 更新后的待办事项列表
 */
export const updateSubtask = (todoId, subtaskId, subtaskData) => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => {
    if (todo.id === todoId) {
      return {
        ...todo,
        subtasks: (todo.subtasks || []).map(subtask => {
          if (subtask.id === subtaskId) {
            return {
              ...subtask,
              ...subtaskData,
              updatedAt: getCurrentTime()
            };
          }
          return subtask;
        }),
        updatedAt: getCurrentTime()
      };
    }
    return todo;
  });

  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * 删除子任务
 * @param {string} todoId - 父任务ID
 * @param {string} subtaskId - 子任务ID
 * @returns {Array} 更新后的待办事项列表
 */
export const deleteSubtask = (todoId, subtaskId) => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => {
    if (todo.id === todoId) {
      return {
        ...todo,
        subtasks: (todo.subtasks || []).filter(subtask => subtask.id !== subtaskId),
        updatedAt: getCurrentTime()
      };
    }
    return todo;
  });

  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * 切换子任务状态
 * @param {string} todoId - 父任务ID
 * @param {string} subtaskId - 子任务ID
 * @param {string} status - 新状态
 * @returns {Array} 更新后的待办事项列表
 */
export const toggleSubtaskStatus = (todoId, subtaskId, status) => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => {
    if (todo.id === todoId) {
      return {
        ...todo,
        subtasks: (todo.subtasks || []).map(subtask => {
          if (subtask.id === subtaskId) {
            return {
              ...subtask,
              status,
              updatedAt: getCurrentTime()
            };
          }
          return subtask;
        }),
        updatedAt: getCurrentTime()
      };
    }
    return todo;
  });

  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * 统计待办事项数据
 * @returns {Object} 统计数据
 */
export const getTodoStatistics = () => {
  const todos = getTodos();
  const total = todos.length;
  const done = todos.filter(todo => todo.status === 'done').length;
  const inProgress = todos.filter(todo => todo.status === 'in-progress').length;
  const todo = todos.filter(todo => todo.status === 'todo').length;

  // 按优先级统计
  const priorityStats = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length
  };

  // 按分类统计
  const categoryStats = {};
  todos.forEach(todo => {
    if (todo.category) {
      categoryStats[todo.category] = (categoryStats[todo.category] || 0) + 1;
    }
  });

  // 完成率
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    total,
    done,
    inProgress,
    todo,
    priorityStats,
    categoryStats,
    completionRate
  };
};

/**
 * 筛选待办事项
 * @param {Array} todos - 待办事项列表
 * @param {Object} filters - 筛选条件
 * @returns {Array} 筛选后的待办事项列表
 */
export const filterTodos = (todos, filters) => {
  let filtered = [...todos];

  // 按状态筛选
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(todo => todo.status === filters.status);
  }

  // 按优先级筛选
  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter(todo => filters.priority.includes(todo.priority));
  }

  // 按分类筛选
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(todo => filters.category.includes(todo.category));
  }

  // 按搜索关键词筛选
  if (filters.search && filters.search.trim()) {
    const keyword = filters.search.toLowerCase().trim();
    filtered = filtered.filter(todo =>
      todo.title.toLowerCase().includes(keyword) ||
      todo.description.toLowerCase().includes(keyword) ||
      (todo.tags && todo.tags.length > 0 && todo.tags.some(tag => tag.toLowerCase().includes(keyword)))
    );
  }

  return filtered;
};