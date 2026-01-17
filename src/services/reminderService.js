// 提醒服务 - 用于处理任务提醒

/**
 * 检查并返回需要提醒的任务
 * @param {Array} todos - 待办事项列表
 * @returns {Array} 需要提醒的任务列表
 */
export const checkReminders = (todos) => {
  const now = new Date();
  const remindersToTrigger = todos.filter(todo => {
    // 检查条件：
    // 1. 有提醒时间
    // 2. 提醒时间未过期
    // 3. 任务状态不是已完成
    // 4. 提醒时间已到或已过
    return (
      todo.reminderTime &&
      !todo.reminded &&
      todo.status !== 'done' &&
      new Date(todo.reminderTime) <= now
    );
  });

  remindersToTrigger.forEach(todo => {
    triggerReminder(todo);
  });

  // 返回需要标记为已提醒的任务ID列表
  return remindersToTrigger.map(todo => todo.id);
};

/**
 * 触发提醒
 * @param {Object} todo - 待办事项
 */
export const triggerReminder = (todo) => {
  // 播放提醒音频
  playReminderSound();

  // 发送浏览器通知
  sendNotification(todo);
};

/**
 * 播放提醒音频
 */
export const playReminderSound = () => {
  try {
    // 创建音频上下文
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // 创建振荡器
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 设置音频参数
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    // 播放音频
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error('播放提醒音频失败:', error);
  }
};

/**
 * 发送浏览器通知
 * @param {Object} todo - 待办事项
 */
export const sendNotification = (todo) => {
  // 检查浏览器是否支持通知
  if (!('Notification' in window)) {
    console.log('此浏览器不支持桌面通知');
    return;
  }

  // 检查通知权限
  if (Notification.permission === 'granted') {
    // 发送通知
    new Notification('任务提醒', {
      body: todo.title,
      icon: '/favicon.ico'
    });
  } else if (Notification.permission !== 'denied') {
    // 请求通知权限
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('任务提醒', {
          body: todo.title,
          icon: '/favicon.ico'
        });
      }
    });
  }
};

/**
 * 初始化提醒服务
 * @param {Function} getTodos - 获取待办事项列表的函数
 */
export const initReminderService = (getTodos) => {
  // 请求通知权限
  if ('Notification' in window) {
    Notification.requestPermission();
  }

  // 每分钟检查一次提醒
  const interval = setInterval(() => {
    const todos = getTodos();
    checkReminders(todos);
  }, 60000);

  // 立即检查一次
  const todos = getTodos();
  checkReminders(todos);

  // 返回清理函数
  return () => clearInterval(interval);
};
