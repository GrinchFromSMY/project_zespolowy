# My Project

This project is a web application consisting of a React frontend and a Python backend using FastAPI. The application uses REST API for client-server communication and RabbitMQ for message handling.

## Installation and start-up

0. Clone the repository:
   ```
   git clone <URL>

### **1. Запуск сервера бэкенда**
1. Перейдите в папку с бэкендом:
   ```bash
   cd project_zespolowy\backend
   ```

2. Убедитесь, что все зависимости установлены:
   ```bash
   pip install -r requirements.txt
   ```

3. Запустите сервер с помощью Uvicorn:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 9000
   ```

4. Сервер будет доступен по адресу:
   ```
   http://localhost:9000
   ```

---

### **2. Запуск фронтенда**
1. Перейдите в папку с фронтендом:
   ```bash
   cd project_zespolowy\frontend
   ```

2. Убедитесь, что все зависимости установлены:
   ```bash
   npm install
   ```

3. Запустите сервер разработки:
   ```bash
   npm start
   ```

4. Фронтенд будет доступен по адресу:
   ```
   http://localhost:3000
   ```

---

### **3. Проверка работы**
- Убедитесь, что бэкенд работает по адресу `http://localhost:9000`.
- Убедитесь, что фронтенд работает по адресу `http://localhost:3000`.
- Фронтенд должен корректно взаимодействовать с бэкендом через API.


