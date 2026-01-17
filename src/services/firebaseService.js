// Firebase服务 - 用于云端数据同步
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// 初始化Firebase应用
const app = initializeApp(firebaseConfig);

// 获取Firestore实例
const db = getFirestore(app);

// 集合名称
const COLLECTIONS = {
  TODOS: 'todos',
  CATEGORIES: 'categories'
};

/**
 * 检查Firebase配置是否有效
 * @returns {boolean} 是否有效
 */
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY';
};

/**
 * 获取所有待办事项
 * @returns {Promise<Array>} 待办事项列表
 */
export const fetchTodosFromFirebase = async () => {
  try {
    const todosCollection = collection(db, COLLECTIONS.TODOS);
    const todosSnapshot = await getDocs(todosCollection);
    return todosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('从Firebase获取待办事项失败:', error);
    return [];
  }
};

/**
 * 保存所有待办事项到Firebase
 * @param {Array} todos - 待办事项列表
 * @returns {Promise<void>}
 */
export const saveTodosToFirebase = async (todos) => {
  try {
    // 批量更新或创建待办事项
    const batchPromises = todos.map(async (todo) => {
      const todoDoc = doc(db, COLLECTIONS.TODOS, todo.id);
      await setDoc(todoDoc, todo, { merge: true });
    });

    await Promise.all(batchPromises);
  } catch (error) {
    console.error('保存待办事项到Firebase失败:', error);
    throw error;
  }
};

/**
 * 获取所有分类
 * @returns {Promise<Array>} 分类列表
 */
export const fetchCategoriesFromFirebase = async () => {
  try {
    const categoriesCollection = collection(db, COLLECTIONS.CATEGORIES);
    const categoriesSnapshot = await getDocs(categoriesCollection);
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('从Firebase获取分类失败:', error);
    return [];
  }
};

/**
 * 保存所有分类到Firebase
 * @param {Array} categories - 分类列表
 * @returns {Promise<void>}
 */
export const saveCategoriesToFirebase = async (categories) => {
  try {
    // 批量更新或创建分类
    const batchPromises = categories.map(async (category) => {
      const categoryDoc = doc(db, COLLECTIONS.CATEGORIES, category.id);
      await setDoc(categoryDoc, category, { merge: true });
    });

    await Promise.all(batchPromises);
  } catch (error) {
    console.error('保存分类到Firebase失败:', error);
    throw error;
  }
};

/**
 * 监听待办事项变化
 * @param {Function} onSnapshot - 变化回调函数
 * @returns {Function} 取消监听函数
 */
export const listenTodosChanges = (onSnapshot) => {
  try {
    const todosCollection = collection(db, COLLECTIONS.TODOS);
    return todosCollection.onSnapshot(onSnapshot);
  } catch (error) {
    console.error('监听待办事项变化失败:', error);
    return () => {};
  }
};

/**
 * 监听分类变化
 * @param {Function} onSnapshot - 变化回调函数
 * @returns {Function} 取消监听函数
 */
export const listenCategoriesChanges = (onSnapshot) => {
  try {
    const categoriesCollection = collection(db, COLLECTIONS.CATEGORIES);
    return categoriesCollection.onSnapshot(onSnapshot);
  } catch (error) {
    console.error('监听分类变化失败:', error);
    return () => {};
  }
};
