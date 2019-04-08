from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

import os

app_object = Flask(__name__)
app_object.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.environ['POSTGRES_USER']}:{os.environ['POSTGRES_PASSWORD']}@{os.environ['POSTGRES_HOST']}/{os.environ['POSTGRES_DB']}"
db = SQLAlchemy(app_object)
migrate = Migrate(app_object, db)
cors = CORS(app_object, resources={r"/*": {"origins": "*"}})

from app import project
from app import stakeholder
from app import comment

app_object.register_blueprint(project.project_api)
app_object.register_blueprint(stakeholder.stakeholder_api)
app_object.register_blueprint(comment.comment_api)


@app_object.route('/')
def health_check():
    return 'alive'
