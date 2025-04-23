# app/endpoints/auth.py
import os
from datetime import datetime, timedelta, timezone
from typing import Annotated # Используем Annotated для лучшей типизации зависимостей

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm # Для стандартной обработки токенов
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt # Для работы с JWT

from .. import models, schemas
from ..database import get_db # Импортируем зависимость get_db

# --- Настройки JWT ---
# ВАЖНО: В реальном приложении храни эти значения безопасно!
# Используй переменные окружения или систему управления секретами.
# НЕ ОСТАВЛЯЙ СЕКРЕТНЫЙ КЛЮЧ В КОДЕ В ОТКРЫТОМ ВИДЕ!
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-and-long-key-example") # ЗАМЕНИ НА СВОЙ СЛОЖНЫЙ КЛЮЧ!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 # Время жизни токена доступа (в минутах)

# Контекст для хеширования паролей (используем bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Схема OAuth2 для получения токена из заголовка Authorization: Bearer <token>
# tokenUrl указывает на эндпоинт, который выдает токен (/api/auth/token)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

router = APIRouter(
    prefix="/auth", # Префикс для всех маршрутов в этом файле
    tags=["auth"]   # Тег для документации Swagger/OpenAPI
)

# --- Вспомогательные функции ---

def get_password_hash(password: str) -> str:
    """Хеширует пароль."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет, соответствует ли обычный пароль хешированному."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Создает JWT токен доступа."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # По умолчанию токен живет ACCESS_TOKEN_EXPIRE_MINUTES
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_username(db: Session, username: str) -> models.User | None:
    """Получает пользователя из БД по имени пользователя."""
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str) -> models.User | None:
    """Получает пользователя из БД по email."""
    return db.query(models.User).filter(models.User.email == email).first()

# --- Зависимость для получения текущего пользователя ---
async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db)
) -> models.User:
    """
    Декодирует токен, проверяет его валидность и возвращает
    текущего пользователя из базы данных.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Декодируем токен
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Извлекаем username (или то, что ты положил в 'sub')
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        # Ошибка декодирования или подписи
        raise credentials_exception

    # Получаем пользователя из БД
    user = get_user_by_username(db, username=token_data.username)
    if user is None:
        # Пользователь, указанный в токене, не найден в БД
        raise credentials_exception
    # Можно добавить проверку user.is_active
    if not user.is_active:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неактивный пользователь")
    return user

# --- Эндпоинты ---

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Регистрирует нового пользователя."""
    # Проверяем, не существует ли уже пользователь с таким email или username
    db_user_by_email = get_user_by_email(db, email=user_data.email)
    if db_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже зарегистрирован"
        )
    db_user_by_username = get_user_by_username(db, username=user_data.username)
    if db_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким именем пользователя уже зарегистрирован"
        )

    # Хешируем пароль
    hashed_password = get_password_hash(user_data.password)

    # Создаем нового пользователя в базе данных
    new_user = models.User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password
        # is_active будет установлено по умолчанию из модели (default=True)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Возвращаем созданного пользователя (без пароля, согласно схеме schemas.User)
    return new_user


# Эндпоинт для входа и получения токена
# Используем OAuth2PasswordRequestForm для получения username и password из формы
@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    """
    Проверяет учетные данные пользователя и возвращает JWT токен доступа.
    Принимает username и password в формате x-www-form-urlencoded.
    """
    # form_data.username может быть как username, так и email
    user = get_user_by_username(db, username=form_data.username)
    # Если по username не нашли, пробуем найти по email
    if not user:
        user = get_user_by_email(db, email=form_data.username)

    # Проверяем, найден ли пользователь и верен ли пароль
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"}, # Стандартный заголовок для 401
        )

    # Проверяем, активен ли пользователь
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неактивный пользователь")

    # Создаем токен доступа
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        # В 'sub' (subject) обычно кладут уникальный идентификатор пользователя
        data={"sub": user.username}, # Используем username как идентификатор в токене
        expires_delta=access_token_expires
    )
    # Возвращаем токен в формате, ожидаемом OAuth2
    return schemas.Token(access_token=access_token, token_type="bearer")


# Пример защищенного эндпоинта: получить информацию о себе
@router.get("/users/me", response_model=schemas.User)
async def read_users_me(
    current_user: Annotated[models.User, Depends(get_current_user)]
):
    """
    Возвращает информацию о текущем авторизованном пользователе.
    Требует валидный JWT токен в заголовке Authorization.
    """
    # Зависимость get_current_user уже проверила токен и вернула пользователя
    return current_user
