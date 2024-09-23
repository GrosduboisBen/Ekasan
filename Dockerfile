FROM python:3.10
RUN apt-get update && apt-get install -y expect

WORKDIR /app

COPY . /app
# COPY ./.env /app/

RUN pip install --no-cache-dir -r requirements.txt 
RUN chmod +x ./scripts/*

# CMD ./scripts/create_auth.sh
