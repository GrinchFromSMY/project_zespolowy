from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String

DATABASE_URL = "sqlite:///./movies.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Модель для таблицы "popular"
class Movie(Base):
    __tablename__ = "popular"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    rating = Column(String, nullable=True)
    url_TMDB = Column(String, nullable=True)

# Модель для таблицы "top_rated"
class TopRatedMovie(Base):
    __tablename__ = "top_rated"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    rating = Column(String, nullable=True)
    url_TMDB = Column(String, nullable=True)

# Модель для таблицы "now_playing"
class NowPlayingMovie(Base):
    __tablename__ = "now_playing"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    rating = Column(String, nullable=True)
    url_TMDB = Column(String, nullable=True)