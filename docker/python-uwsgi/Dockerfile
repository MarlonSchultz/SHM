# Dependencies
FROM python:3.6-alpine as build-deps

RUN apk add --no-cache linux-headers g++ postgresql-dev gcc build-base linux-headers \
    ca-certificates python3-dev libffi-dev libressl-dev libxslt-dev
RUN pip wheel --wheel-dir=/root/wheels psycopg2
RUN pip wheel --wheel-dir=/root/wheels cryptography

# Actual Image
FROM python:3.6-alpine

EXPOSE 8080
WORKDIR /app

COPY ./app-backend /app
COPY ./docker/python-uwsgi/uwsgi.ini /app/uwsgi.ini
COPY --from=build-deps /root/wheels /root/wheels

RUN apk add --no-cache build-base linux-headers pcre-dev libpq && \
    pip install --no-index --find-links=/root/wheels /root/wheels/* && \
    pip install uwsgi

RUN pip install -r /app/requirements.txt

CMD ["uwsgi", "--ini", "/app/uwsgi.ini"]