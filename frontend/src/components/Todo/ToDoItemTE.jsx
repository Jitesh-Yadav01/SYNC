import React, { useState } from "react";
import "./ToDoTE.css";

const ToDoItemTE = ({ todo, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  const toggle = () => {
    onUpdate(todo.id, { ...todo, completed: !todo.completed });
  };

  const save = () => {
    const value = text.trim();
    if (!value) return;
    onUpdate(todo.id, { ...todo, text: value });
    setEditing(false);
  };

  const cancel = () => {
    setText(todo.text);
    setEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? "done" : ""}`}>
      <input type="checkbox" checked={todo.completed} onChange={toggle} />

      {!editing ? (
        <span
          className="todo-text"
          onDoubleClick={() => setEditing(true)}
        >
          {todo.text}
        </span>
      ) : (
        <div className="todo-edit">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <button onClick={save}>✓</button>
          <button onClick={cancel}>✕</button>
        </div>
      )}

      <button className="todo-delete" onClick={() => onDelete(todo.id)}>
        ×
      </button>
    </div>
  );
};

export default ToDoItemTE;
