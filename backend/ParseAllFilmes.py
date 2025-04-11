import os

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from bs4 import BeautifulSoup
import sqlite3
import time


# Уникальный путь для user-data-dir
user_data_dir = os.path.join(os.getcwd(), "chrome_user_data")

# Параметры для Chrome
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument(f"user-data-dir={user_data_dir}")  # Указание пути для user-data-dir
# Запуск браузера
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get("https://www.themoviedb.org/pl")
driver.add_cookie({'name': 'language', 'value': 'pl-PL'})
# Даем время странице на загрузку
WebDriverWait(driver, 15).until(
    EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.card.style_1"))
)

# Ждём ещё чуть-чуть для уверенности
time.sleep(2)

# Получаем HTML после того, как страница загрузится
soup = BeautifulSoup(driver.page_source, 'html.parser')
print(soup.prettify())  # Выводит весь HTML, чтобы вы могли увидеть структуру
# Ищем все блоки с фильмами
movie_containers = soup.find_all('div', class_='card style_1')


# Подключаемся к базе данных SQLite
conn = sqlite3.connect('movies.db')  # Создаст файл movies.db, если его нет
cursor = conn.cursor()

# Создаем таблицу, если она не существует
cursor.execute('''
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image_url TEXT,
        rating TEXT,
        url_TMDB TEXT
    )
''')
# Обрабатываем каждый фильм
for movie in movie_containers:
    # Извлекаем название фильма
    title_tag = movie.find('h2')
    title = title_tag.text.strip() if title_tag else "Название не найдено"

    # Извлекаем ссылку на изображение
    image_tag = movie.find('img')  # Исправлено: заменен 'image' на 'img'
    image_url = image_tag['src'] if image_tag else None

    # Извлекаем рейтинг
    rating_tag = movie.find('div', class_='user_score_chart')
    rating = rating_tag.get('data-percent', 'Рейтинг не найден') if rating_tag else 'Рейтинг не найден'

    # Извлекаем ссылку на страницу фильма
    url_tag = movie.find('a', class_='image')  # Ссылка на страницу фильма
    url = "https://www.themoviedb.org" + url_tag['href'] if url_tag else None

    # Проверяем, существует ли фильм с таким названием
    cursor.execute('SELECT * FROM movies WHERE title = ?', (title,))
    movie_in_db = cursor.fetchone()

    if movie_in_db:
        # Если фильм существует, обновляем его данные
        cursor.execute('''
                UPDATE movies
                SET image_url = ?, rating = ?, url_TMDB = ?
                WHERE title = ?
            ''', (image_url, rating, url, title))
        print(f"Данные фильма '{title}' обновлены.")
    else:
        # Если фильма нет, добавляем новый фильм
        cursor.execute('''
                INSERT INTO movies (title, image_url, rating, url_TMDB)
                VALUES (?, ?, ?, ?)
            ''', (title, image_url, rating, url))
        print(f"Фильм '{title}' добавлен в базу данных.")

# Сохраняем изменения и закрываем соединение
conn.commit()
conn.close()

print("Операция завершена.")
