from fastapi import APIRouter, HTTPException
from ..schemas.example import ExampleSchema
from ..models.example import ExampleModel
from ..services.rabbitmq import send_message

router = APIRouter()

@router.post("/example", response_model=ExampleSchema)
async def create_example(example: ExampleSchema):
    try:
        # Сохранение примера в базе данных
        example_model = ExampleModel(**example.dict())
        # Здесь должна быть логика сохранения в БД
        # Например: db.add(example_model)
        # db.commit()
        
        # Отправка сообщения в RabbitMQ
        send_message(example_model)
        
        return example_model
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/example/{example_id}", response_model=ExampleSchema)
async def read_example(example_id: int):
    try:
        # Здесь должна быть логика получения из БД
        # Например: example_model = db.query(ExampleModel).filter(ExampleModel.id == example_id).first()
        
        if not example_model:
            raise HTTPException(status_code=404, detail="Example not found")
        
        return example_model
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))