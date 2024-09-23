import psycopg2
import time
def is_postgres_ready():
    try:
        conn = psycopg2.connect(
            host="pgdb",
            user="ekasan_user",
            password="ekasan_secure_password",
            dbname="ekasan_db_renew"
        )
        conn.close()
        return True
    except psycopg2.OperationalError:
        return False

# Attendre jusqu'à ce que PostgreSQL soit prêt
max_retries = 10
retries = 0
while not is_postgres_ready() and retries < max_retries:
    time.sleep(6)
    retries += 1