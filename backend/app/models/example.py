from sqlalchemy import Column, Integer, String
from backend.app.core.config import Base

class ExampleModel(Base):
    __tablename__ = 'examples'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)