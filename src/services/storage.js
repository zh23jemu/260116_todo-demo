// 存储服务 - 用于本地数据持久化

// 存储键名
const STORAGE_KEYS = {
  TODOS: 'todo-app-todos',
  CATEGORIES: 'todo-app-categories'
};

/**
 * 获取存储的数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @returns {any} 存储的数据或默认值
 */
export const getStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('读取存储失败:', error);
    return defaultValue;
  }
};

/**
 * 设置存储的数据
 * @param {string} key - 存储键名
 * @param {any} value - 要存储的值
 */
export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('写入存储失败:', error);
  }
};

/**
 * 移除存储的数据
 * @param {string} key - 存储键名
 */
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('移除存储失败:', error);
  }
};

/**
 * 清空所有存储数据
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('清空存储失败:', error);
  }
};

// 待办事项相关存储操作

export const getTodos = () => {
  return getStorage(STORAGE_KEYS.TODOS, []);
};

export const saveTodos = (todos) => {
  setStorage(STORAGE_KEYS.TODOS, todos);
};

// 分类相关存储操作

export const getCategories = () => {
  return getStorage(STORAGE_KEYS.CATEGORIES, [
    { id: '1', name: '工作', color: '#1890ff' },
    { id: '2', name: '生活', color: '#52c41a' },
    { id: '3', name: '学习', color: '#faad14' }
  ]);
};

export const saveCategories = (categories) => {
  setStorage(STORAGE_KEYS.CATEGORIES, categories);
};