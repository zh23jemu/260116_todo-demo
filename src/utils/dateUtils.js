// 日期处理工具函数
import dayjs from 'dayjs';

/**
 * 格式化日期为指定格式
 * @param {string|Date} date - 日期对象或字符串
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * 格式化日期为相对时间（如：3小时前）
 * @param {string|Date} date - 日期对象或字符串
 * @returns {string} 相对时间字符串
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

/**
 * 判断日期是否已过期
 * @param {string|Date} date - 日期对象或字符串
 * @returns {boolean} 是否已过期
 */
export const isExpired = (date) => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs(), 'day');
};

/**
 * 判断日期是否为今天
 * @param {string|Date} date - 日期对象或字符串
 * @returns {boolean} 是否为今天
 */
export const isToday = (date) => {
  if (!date) return false;
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * 判断日期是否为明天
 * @param {string|Date} date - 日期对象或字符串
 * @returns {boolean} 是否为明天
 */
export const isTomorrow = (date) => {
  if (!date) return false;
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day');
};

/**
 * 获取日期的中文描述
 * @param {string|Date} date - 日期对象或字符串
 * @returns {string} 中文日期描述
 */
export const getDateDescription = (date) => {
  if (!date) return '';
  
  if (isToday(date)) {
    return '今天';
  } else if (isTomorrow(date)) {
    return '明天';
  } else if (dayjs(date).isBefore(dayjs(), 'day')) {
    return '已过期';
  } else {
    return formatDate(date, 'MM-DD');
  }
};