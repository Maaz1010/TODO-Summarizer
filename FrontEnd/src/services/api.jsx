import axios from 'axios';
const API_URL = 'http://localhost:8080/todos';

export const getTodos = () => axios.get(API_URL);
export const addTodo = (todo) => axios.post(API_URL, todo);
export const deleteTodo = (id) => axios.delete(`${API_URL}/${id}`);
export const summarizeTodos = () => axios.post(`${API_URL}/summarize`);
