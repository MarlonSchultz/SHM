from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app_object = Flask(__name__)
#app_object.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
app_object.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test:password@postgres/example'
db = SQLAlchemy(app_object)

from app.project import project_api

app_object.register_blueprint(project_api)


@app_object.route('/')
def health_check():
    return 'alive'
