from pydantic import BaseModel
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

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int

    class Config:
        orm_mode = True