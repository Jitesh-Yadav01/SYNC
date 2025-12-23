import React, { useState } from "react";
import TodoItem from "./ToDoItemTE";
import useLocalStorage from "../../hooks/useLocalStorage";
import "./ToDoTE.css";

const STORAGE_KEY = "syncait_todos_v1";

const ToDoListTE = () => {
  const [todos, setTodos] = useLocalStorage(STORAGE_KEY, []);
  
  const [input, setInput] = useState("");


  const addTodo = () => {
    const text = input.trim();
    if (!text) return;

    setTodos([
      { id: Date.now(), text, completed: false },
      ...todos,
    ]);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  const updateTodo = (id, updated) => {
    setTodos(todos.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <section className="dashboard-section todo-section-bg">
      <div className="todo-wrapper">
        <h2 className="dashboard-title">My To-Do</h2>
        <div className="dashboard-divider" />

        <div className="todo-inner-card">
          <div className="todo-input-row">
            <input
              className="todo-input"
              placeholder="Add a new task"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button className="todo-add-button" onClick={addTodo}>
              Add
            </button>
          </div>

          <div className="todo-list">
            {todos.length === 0 && (
              <div className="todo-empty">No tasks yet</div>
            )}

            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToDoListTE;