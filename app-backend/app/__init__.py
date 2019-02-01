from flask import Flask
from flask_sqlalchemy import SQLAlchemy

import os

app_object = Flask(__name__)
app_object.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.environ['POSTGRES_USER']}:{os.environ['POSTGRES_PASSWORD']}@{os.environ['POSTGRES_HOST']}/{os.environ['POSTGRES_DB']}"
db = SQLAlchemy(app_object)

from app.project import project_api

app_object.register_blueprint(project_api)


@app_object.route('/')
def health_check():
    return 'alive'
