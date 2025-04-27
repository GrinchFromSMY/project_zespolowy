# Backend Documentation

This project is a web application that uses FastAPI to create a REST API and RabbitMQ for message handling.

## Project Structure

- **app/**: The main application directory.
  - **main.py**: Starts the server and configures routes for the REST API.
  - **api/**: Contains API versions and their endpoints.
    - **v1/**: The first version of the API.
      - **endpoints/**: Definitions of routes and handlers.
        - **example.py**: Example API routes.
  - **core/**: Application configuration.
    - **config.py**: RabbitMQ connection settings and other parameters.
  - **models/**: Data model definitions.
    - **example.py**: Example data model.
  - **schemas/**: Schemas for data validation.
    - **example.py**: Example schema.
  - **services/**: Services for interacting with external systems.
    - **rabbitmq.py**: Functions for working with RabbitMQ.
  - **utils/**: Utility functions.
    - **example.py**: Example utility function.

## Installation

1. Clone the repository:
   ```
   git clone <URL>
   cd my-project/backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the application:
   ```
   uvicorn app.main:app --reload
   ```

## Using RabbitMQ

To work with RabbitMQ, ensure it is installed and running. Connection settings can be found in `app/core/config.py`.

## Containerization

The project can be run in Docker. Use the `Dockerfile` and `docker-compose.yml` files located in the root of the project.

## License

This project is licensed under the MIT License.