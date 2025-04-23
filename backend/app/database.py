# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# --- Настройки подключения к БД ---

# Используем SQLite как значение по умолчанию, если DATABASE_URL не задана
# Или укажи дефолтный URL для PostgreSQL с реальным портом, например:
# DEFAULT_DB_URL = "postgresql://user:password@host:5432/dbname"
DEFAULT_DB_URL = "sqlite:///./movies.db"

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

# Определяем, используется ли SQLite
is_sqlite = SQLALCHEMY_DATABASE_URL.startswith("sqlite")

# Создание движка SQLAlchemy
# Добавляем connect_args только для SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if is_sqlite else {}
)

# Создание фабрики сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей SQLAlchemy
Base = declarative_base()

# --- Функция-зависимость get_db ---
def get_db():
    """
    Зависимость FastAPI для получения сессии базы данных.
    Создает сессию для каждого запроса и закрывает ее после завершения.
    """
    db = SessionLocal()
    try:
        yield db # Предоставляет сессию эндпоинту
    finally:
        db.close() # Закрывает сессию после использования

# --- Убедись, что твои модели импортируются где-то,
# --- чтобы Base знал о них перед create_all (если ты его используешь)
# from . import models # Например
