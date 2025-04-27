# Frontend Documentation

This project is a web application developed using React for the frontend and Python with FastAPI for the backend. This file describes the main aspects of working with the frontend part of the application.

## Project Structure

- `public/index.html`: The main HTML file that loads the React application.
- `src/components/`: Directory containing React components that can be used across various pages of the application.
- `src/pages/`: Directory containing application pages that use components to display content.
- `src/App.jsx`: The root component of the application, which defines routing and the structure of the app.
- `src/index.js`: The entry point for the application, rendering the root component.
- `src/services/api.js`: Functions for interacting with the backend REST API.

## Installation

1. Clone the repository:
   ```
   git clone <URL>
   cd my-project/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

To start the application, use the command:
```
npm start
```
The application will be available at `http://localhost:3000`.

## Interaction with the Backend

The frontend interacts with the backend via the REST API. Ensure the backend is running and accessible at the specified address.

## License

This project is licensed under the MIT License.