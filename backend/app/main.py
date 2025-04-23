# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import movies, auth # Импортируем новый роутер auth
from . import models # Убедись, что модели импортируются для создания таблиц
from .database import engine

# Создаем таблицы при запуске (включая новую таблицу users)
# В продакшене лучше использовать Alembic для миграций
try:
    models.Base.metadata.create_all(bind=engine)
    print("Database tables created successfully (if they didn't exist).")
except Exception as e:
    print(f"Error creating database tables: {e}")


app = FastAPI(
    title="Movie API with Auth",
    description="API для получения информации о фильмах с регистрацией и аутентификацией пользователей.",
    version="1.0.0",
)

# --- Настройка CORS ---
# Укажи адреса, с которых твой React-фронтенд будет делать запросы
# Замени "*" на конкретные адреса в продакшене для безопасности!
origins = [
    "http://localhost",         # Стандартный адрес без порта
    "http://localhost:3000",    # Стандартный порт для React (create-react-app)
    "http://localhost:5173",    # Стандартный порт для Vite (React/Vue)
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    # "https://your-frontend-domain.com", # Добавь адрес твоего развернутого фронтенда
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Разрешенные источники (ВАЖНО для безопасности в проде)
    allow_credentials=True, # Разрешить куки (если будешь использовать)
    allow_methods=["*"],    # Разрешить все методы (GET, POST, PUT и т.д.)
    allow_headers=["*"],    # Разрешить все заголовки (включая Authorization)
)
# --- Конец настройки CORS ---


# Подключение маршрутов
app.include_router(movies.router, prefix="/api", tags=["movies"])
app.include_router(auth.router, prefix="/api", tags=["auth"]) # Подключаем роутер аутентификации

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Movie API with Authentication!"}

# Можно добавить обработку 404 для /api/*, если нужно
# @app.get("/api/{full_path:path}")
# async def handle_404_api(full_path: str):
#     raise HTTPException(status_code=404, detail="API endpoint not found")
