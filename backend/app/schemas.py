# app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List

class Actor(BaseModel):
    name: str
    character: str
    photo_url: Optional[str] = None

class MovieBase(BaseModel):
    title: str
    image_url: Optional[str] = None
    rating: Optional[str] = None
    url_TMDB: Optional[str] = None
    description: Optional[str] = None
    genres: Optional[List[str]] = []
    creator: Optional[str] = None
    actors: Optional[List[Actor]] = []

# --- Схемы для аутентификации ---

# Схема для данных, получаемых при регистрации
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Схема для данных, возвращаемых API (без пароля)
class User(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True # Для совместимости с SQLAlchemy v1.x
        # Если используешь SQLAlchemy v2.x, orm_mode устарел,
        # Pydantic v2 сам определяет это. Убери Config, если Pydantic v2.

# Схема для ответа с токеном
class Token(BaseModel):
    access_token: str
    token_type: str

# Схема для данных внутри токена (полезно для get_current_user)
class TokenData(BaseModel):
    username: str | None = None

# --- Схемы для фильмов ---

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int

    class Config:
        orm_mode = True # См. комментарий выше
