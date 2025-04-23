import os
import sqlite3
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# --- Константы ---
BASE_URL = "https://www.themoviedb.org"
DB_NAME = 'movies_all.db'
PAGES_TO_PARSE = 3

# --- Таблицы и соответствующие URL ---
TABLES = {
    'popular': '/movie?language=pl-PL&page=',
    'now_playing': '/movie/now-playing?language=pl-PL&page=',
    'top_rated': '/movie/top-rated?language=pl-PL&page='
}

# --- Настройка WebDriver ---
chrome_options = webdriver.ChromeOptions()
# chrome_options.add_argument("--headless")
# chrome_options.add_argument("--disable-gpu")

driver = None
conn = None

try:
    print("Запуск WebDriver...")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    # Установка языка через cookie
    driver.get(f"{BASE_URL}/pl")
    time.sleep(1)
    driver.add_cookie({'name': 'tmdb.prefs', 'value': '{"language":"pl-PL"}', 'domain': '.themoviedb.org'})

    # Подключение к БД
    print(f"Подключение к базе данных: {DB_NAME}")
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Создание таблиц
    for table in TABLES.keys():
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS {table} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL UNIQUE,
                image_url TEXT,
                rating TEXT,
                url_TMDB TEXT UNIQUE
            )
        ''')
    conn.commit()
    print("Все таблицы готовы.")

    # --- Функция парсинга страницы ---
    def parse_and_store(category, page_number):
        page_url = BASE_URL + TABLES[category] + str(page_number)
        print(f"[{category}] Парсинг страницы {page_number}: {page_url}")
        driver.get(page_url)
        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.card.style_1"))
            )
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            movies = soup.find_all('div', class_='card style_1')
            for movie in movies:
                title_tag = movie.find('h2')
                title = title_tag.text.strip() if title_tag else None

                image_tag = movie.find('img')
                image_url = image_tag['src'] if image_tag and 'src' in image_tag.attrs else None

                rating_tag = movie.find('div', class_='user_score_chart')
                rating = rating_tag.get('data-percent') if rating_tag else None

                url_tag = movie.find('a', class_='image')
                url = f"{BASE_URL}{url_tag['href']}" if url_tag and 'href' in url_tag.attrs else None

                if not title or not url:
                    print(f"[{category}] Пропущен фильм без названия или URL.")
                    continue

                # Вставка или обновление
                cursor.execute(f'SELECT id FROM {category} WHERE url_TMDB = ?', (url,))
                exists = cursor.fetchone()

                if exists:
                    movie_id = exists[0]
                    cursor.execute(f'''
                        UPDATE {category}
                        SET title = ?, image_url = ?, rating = ?
                        WHERE id = ?
                    ''', (title, image_url, rating, movie_id))
                    print(f"[{category}] Обновлен: {title}")
                else:
                    cursor.execute(f'''
                        INSERT INTO {category} (title, image_url, rating, url_TMDB)
                        VALUES (?, ?, ?, ?)
                    ''', (title, image_url, rating, url))
                    print(f"[{category}] Добавлен: {title}")

            conn.commit()
        except Exception as e:
            print(f"[{category}] Ошибка парсинга страницы {page_number}: {e}")

    # --- Парсинг всех категорий ---
    for category in TABLES.keys():
        for page in range(1, PAGES_TO_PARSE + 1):
            parse_and_store(category, page)
            time.sleep(1)

    print("Парсинг завершен.")

except Exception as e:
    import traceback
    print(f"Произошла ошибка: {e}")
    traceback.print_exc()
finally:
    if conn:
        print("Закрытие соединения с БД...")
        conn.close()
    if driver:
        print("Закрытие WebDriver...")
        driver.quit()

print("Готово.")
