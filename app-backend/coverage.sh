#!/bin/bash

source venv/bin/activate
source ../docker/postgres/database.conf
export POSTGRES_USER
export POSTGRES_PASSWORD
export POSTGRES_HOST
export POSTGRES_PORT
export POSTGRES_DB

coverage run -m unittest
coverage report
coverage html

if [ -z "$1" ]; then
	echo "";
else
	if [ $1 = "html" ]; then
		xdg-open ./htmlcov/index.html
	fi
fi
