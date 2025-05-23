
import { useState, useEffect } from 'react';
import { getTodos, addTodo, deleteTodo, summarizeTodos } from './services/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await getTodos();
    setTodos(res.data);
  };

  const handleAddOrUpdate = async () => {
    if (task.trim()) {
      if (editingTodo) {
        await addTodo({ id: editingTodo.id, task, completed: editingTodo.completed });
        setEditingTodo(null);
      } else {
        await addTodo({ task, completed: false });
      }
      setTask("");
      fetchTodos();
    }
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    fetchTodos();
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setEditingTodo(todo);
  };

  const handleToggleComplete = async (todo) => {
    await addTodo({ id: todo.id, task: todo.task, completed: !todo.completed });
    fetchTodos();
  };

  const handleSummarize = async () => {
    const res = await summarizeTodos();
    alert(res.data);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">📝 Todo Summary Assistant</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border border-gray-300 p-3 flex-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button
          onClick={handleAddOrUpdate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md font-semibold"
        >
          {editingTodo ? 'Update' : 'Add'}
        </button>
      </div>

      <ul className="space-y-3 mb-6">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
                className="h-5 w-5 text-indigo-600"
              />
              <span className={`text-lg ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                {todo.task}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(todo)}
                className="text-yellow-500 hover:text-yellow-600 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSummarize}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-bold text-lg"
      >
        📋 Summarize Todos
      </button>
    </div>
  );
}

export default App;
