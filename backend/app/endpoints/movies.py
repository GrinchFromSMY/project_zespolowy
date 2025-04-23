from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal, engine
import requests
from bs4 import BeautifulSoup
import re

# Создаем таблицы в базе данных
models.Base.metadata.create_all(bind=engine)

router = APIRouter()

# Зависимость для получения сессии базы данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/movies/", response_model=schemas.Movie)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    db_movie = models.Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.get("/movies/", response_model=list[schemas.Movie])
def read_movies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Movie).offset(skip).limit(limit).all()




# Маршрут для фильмов из таблицы "popular"
@router.get("/movies/popular/", response_model=list[schemas.Movie])
def read_popular_movies(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.Movie).offset(skip).limit(limit).all()

# Маршрут для фильмов из таблицы "top_rated"
@router.get("/movies/top-rated/", response_model=list[schemas.Movie])
def read_top_rated_movies(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.TopRatedMovie).offset(skip).limit(limit).all()

# Маршрут для фильмов из таблицы "now_playing"
@router.get("/movies/now-playing/", response_model=list[schemas.Movie])
def read_now_playing_movies(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.NowPlayingMovie).offset(skip).limit(limit).all()





@router.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie_details(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Фильм не найден")

    # Парсим данные с TMDB, используя ваш скрипт
    url = movie.url_TMDB
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Ошибка при загрузке данных с TMDB")

    soup = BeautifulSoup(response.text, 'html.parser')

    # Извлекаем данные
    title_tag = soup.find('div', class_=re.compile('title ott_(true|false)'))
    title = title_tag.find('a').text.strip() if title_tag and title_tag.find('a') else "Название не найдено"

    image_tag = soup.find('img', class_='poster')
    image_url = image_tag['src'] if image_tag else None

    rating_tag = soup.find('div', class_='user_score_chart')
    rating = rating_tag['data-percent'] if rating_tag else "Рейтинг не найден"

    description_tag = soup.find('div', class_='overview')
    description = description_tag.text.strip() if description_tag else "Описание не найдено"

    genres_tag = soup.find('span', class_='genres')
    genres = [genre.text.strip() for genre in genres_tag.find_all('a')] if genres_tag else []

    creator_tag = soup.find('li', class_='profile')
    creator = creator_tag.find('a').text.strip() if creator_tag else "Создатель не найден"

    actors = []
    actor_tags = soup.find_all('li', class_='card')
    for actor_tag in actor_tags:
        actor_name_tag = actor_tag.find('a')
        actor_name = actor_name_tag.text.strip() if actor_name_tag else "Актер не найден"
        character = actor_tag.find('p', class_='character').text.strip() if actor_tag.find('p', class_='character') else "Персонаж не найден"
        photo_tag = actor_tag.find('img', class_='profile')
        photo_url = photo_tag['src'] if photo_tag else "Фото не найдено"
        actors.append({"name": actor_name, "character": character, "photo_url": photo_url})

    # Возвращаем данные
    return {
        "id": movie.id,
        "title": title,
        "image_url": image_url,
        "rating": rating,
        "description": description,
        "genres": genres,
        "creator": creator,
        "actors": actors
    }
