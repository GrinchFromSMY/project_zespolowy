import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // URL вашего бэкенда
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Пример функции для получения данных
export const getExampleData = async () => {
    try {
        const response = await apiClient.get('/example');
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
};

// Пример функции для отправки данных
export const postExampleData = async (data) => {
    try {
        const response = await apiClient.post('/example', data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        throw error;
    }
};