#!/bin/bash

source venv/bin/activate
source ../docker/postgres/database.conf
export POSTGRES_USER
export POSTGRES_PASSWORD
export POSTGRES_HOST
export POSTGRES_PORT
export POSTGRES_DB

python3 -m unittest