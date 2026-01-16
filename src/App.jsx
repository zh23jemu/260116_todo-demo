import React from 'react';
import { TodoProvider } from './contexts/TodoContext';
import Home from './views/Home';
import './App.css';

/**
 * App组件 - 应用入口组件
 * @returns {JSX.Element} App组件
 */
function App() {
  return (
    <TodoProvider>
      <div className="app-container">
        <Home />
      </div>
    </TodoProvider>
  );
}

export default App;
