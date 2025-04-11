from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import movies

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все источники
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение маршрутов
app.include_router(movies.router, prefix="/api", tags=["movies"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Movie API!"}