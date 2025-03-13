from pydantic import BaseModel
from typing import Optional

class ExampleSchema(BaseModel):
    id: Optional[int]
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True