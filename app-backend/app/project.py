from flask import Blueprint, request
from werkzeug.wrappers import Response

from app import db


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), unique=False, nullable=False)
    description = db.Column(db.Text(), unique=False, nullable=True)


def create_project(name: str, description: str) -> Project:
    project = Project(name=name, description=description)
    db.session.add(project)
    db.session.commit()

    return project


project_api = Blueprint('Project API', __name__)


@project_api.route('/projects', methods=['POST'])
def projects():
    json_data = request.get_json()
    project = create_project(name=json_data['name'], description=json_data['description'])

    return Response(status='201 Created', headers={'Location': f'/project/{project.id}'})
