from flask import Blueprint, request, jsonify
from werkzeug.wrappers import Response

from app import db


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), unique=False, nullable=False)
    description = db.Column(db.Text(), unique=False, nullable=True)

    def to_json(self):
        return {'id': self.id, 'name': self.name, 'description': self.description}


def create_project(name: str, description: str) -> Project:
    project = Project(name=name, description=description)
    db.session.add(project)
    db.session.commit()

    return project


def list_projects() -> []:
    project_list = Project.query.all()
    return project_list


project_api = Blueprint('Project API', __name__)


@project_api.route('/projects', methods=['POST'])
def post_projects():
    json_data = request.get_json()
    project = create_project(name=json_data['name'], description=json_data['description'])

    return Response(status='201 Created', headers={'Location': f'/project/{project.id}'})


@project_api.route('/projects', methods=['GET'])
def get_projects():
    project_list = list_projects()
    json_project_list = [project.to_json() for project in project_list]
    return jsonify(json_project_list)
