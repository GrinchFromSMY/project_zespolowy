import os

class Config:
    # Основные настройки приложения
    APP_NAME = os.getenv("APP_NAME", "My FastAPI Application")
    DEBUG = os.getenv("DEBUG", "False") == "True"

    # Настройки для подключения к RabbitMQ
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
    RABBITMQ_PORT = os.getenv("RABBITMQ_PORT", 5672)
    RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
    RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")
    RABBITMQ_VHOST = os.getenv("RABBITMQ_VHOST", "/")

    # Другие настройки приложения
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")