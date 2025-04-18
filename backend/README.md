# Документация для бэкенда

Этот проект представляет собой веб-приложение, использующее FastAPI для создания REST API и RabbitMQ для обработки сообщений. 

## Структура проекта

- **app/**: Основная директория приложения.
  - **main.py**: Запускает сервер и настраивает маршруты для REST API.
  - **api/**: Содержит версии API и их конечные точки.
    - **v1/**: Первая версия API.
      - **endpoints/**: Определения маршрутов и обработчиков.
        - **example.py**: Пример маршрутов API.
  - **core/**: Конфигурация приложения.
    - **config.py**: Настройки подключения к RabbitMQ и другие параметры.
  - **models/**: Определения моделей данных.
    - **example.py**: Пример модели данных.
  - **schemas/**: Схемы для валидации данных.
    - **example.py**: Пример схемы.
  - **services/**: Сервисы для взаимодействия с внешними системами.
    - **rabbitmq.py**: Функции для работы с RabbitMQ.
  - **utils/**: Вспомогательные функции.
    - **example.py**: Пример вспомогательной функции.

## Установка

1. Клонируйте репозиторий:
   ```
   git clone <URL>
   cd my-project/backend
   ```

2. Установите зависимости:
   ```
   pip install -r requirements.txt
   ```

3. Запустите приложение:
   ```
   uvicorn app.main:app --reload
   ```

## Использование RabbitMQ

Для работы с RabbitMQ убедитесь, что он установлен и запущен. Настройки подключения можно найти в `app/core/config.py`.

## Контейнеризация

Проект можно запустить в Docker. Для этого используйте файл `Dockerfile` и `docker-compose.yml` в корне проекта.

## Лицензия

Этот проект лицензирован под MIT License.