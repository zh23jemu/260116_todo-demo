// 存储服务 - 用于本地数据持久化和云端同步
import {
  isFirebaseConfigured,
  fetchTodosFromFirebase,
  saveTodosToFirebase,
  fetchCategoriesFromFirebase,
  saveCategoriesToFirebase
} from './firebaseService';

// 存储键名
const STORAGE_KEYS = {
  TODOS: 'todo-app-todos',
  CATEGORIES: 'todo-app-categories',
  SYNC_ENABLED: 'todo-app-sync-enabled'
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

/**
 * 检查是否启用了同步功能
 * @returns {boolean} 是否启用同步
 */
export const isSyncEnabled = () => {
  return getStorage(STORAGE_KEYS.SYNC_ENABLED, false);
};

/**
 * 设置是否启用同步功能
 * @param {boolean} enabled - 是否启用同步
 */
export const setSyncEnabled = (enabled) => {
  setStorage(STORAGE_KEYS.SYNC_ENABLED, enabled);
};

// 待办事项相关存储操作

export const getTodos = async () => {
  const localTodos = getStorage(STORAGE_KEYS.TODOS, []);
  
  // 如果启用了同步且Firebase配置有效，尝试从Firebase获取数据
  if (isSyncEnabled() && isFirebaseConfigured()) {
    try {
      const firebaseTodos = await fetchTodosFromFirebase();
      // 如果Firebase有数据，优先使用Firebase数据
      if (firebaseTodos.length > 0) {
        // 更新本地存储
        saveTodosLocal(firebaseTodos);
        return firebaseTodos;
      }
    } catch (error) {
      console.error('从Firebase获取待办事项失败，使用本地数据:', error);
    }
  }
  
  return localTodos;
};

/**
 * 本地保存待办事项
 * @param {Array} todos - 待办事项列表
 */
const saveTodosLocal = (todos) => {
  setStorage(STORAGE_KEYS.TODOS, todos);
};

export const saveTodos = async (todos) => {
  // 先保存到本地存储
  saveTodosLocal(todos);
  
  // 如果启用了同步且Firebase配置有效，同步到Firebase
  if (isSyncEnabled() && isFirebaseConfigured()) {
    try {
      await saveTodosToFirebase(todos);
    } catch (error) {
      console.error('保存待办事项到Firebase失败:', error);
    }
  }
};

// 分类相关存储操作

export const getCategories = async () => {
  const localCategories = getStorage(STORAGE_KEYS.CATEGORIES, [
    { id: '1', name: '工作', color: '#1890ff' },
    { id: '2', name: '生活', color: '#52c41a' },
    { id: '3', name: '学习', color: '#faad14' }
  ]);
  
  // 如果启用了同步且Firebase配置有效，尝试从Firebase获取数据
  if (isSyncEnabled() && isFirebaseConfigured()) {
    try {
      const firebaseCategories = await fetchCategoriesFromFirebase();
      // 如果Firebase有数据，优先使用Firebase数据
      if (firebaseCategories.length > 0) {
        // 更新本地存储
        saveCategoriesLocal(firebaseCategories);
        return firebaseCategories;
      }
    } catch (error) {
      console.error('从Firebase获取分类失败，使用本地数据:', error);
    }
  }
  
  return localCategories;
};

/**
 * 本地保存分类
 * @param {Array} categories - 分类列表
 */
const saveCategoriesLocal = (categories) => {
  setStorage(STORAGE_KEYS.CATEGORIES, categories);
};

export const saveCategories = async (categories) => {
  // 先保存到本地存储
  saveCategoriesLocal(categories);
  
  // 如果启用了同步且Firebase配置有效，同步到Firebase
  if (isSyncEnabled() && isFirebaseConfigured()) {
    try {
      await saveCategoriesToFirebase(categories);
    } catch (error) {
      console.error('保存分类到Firebase失败:', error);
    }
  }
};