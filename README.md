# My Project

This project is a web application consisting of a React frontend and a Python backend using FastAPI. The application uses a REST API for client-server communication and RabbitMQ for message handling.

## Installation and start-up

0. Clone the repository:
   ```
   git clone <URL>
   ```

### **1. Starting the backend server**
1. Navigate to the backend folder:
   ```bash
   cd project_zespolowy\backend
   ```

2. Ensure all dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 9000
   ```

4. The server will be available at:
   ```
   http://localhost:9000
   ```

---

### **2. Starting the frontend**
1. Navigate to the frontend folder:
   ```bash
   cd project_zespolowy\frontend
   ```

2. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will be available at:
   ```
   http://localhost:3000
   ```

---

### **3. Verifying functionality**
- Ensure the backend is running at `http://localhost:9000`.
- Ensure the frontend is running at `http://localhost:3000`.
- The frontend should correctly interact with the backend via the API.


