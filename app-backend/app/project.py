from flask import Blueprint, request, jsonify
from sqlalchemy.exc import OperationalError, ProgrammingError
from werkzeug.wrappers import Response

from app import db


class Project(db.Model):
    """
    Project class.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), unique=False, nullable=False)
    description = db.Column(db.Text(), unique=False, nullable=True)

    def to_json(self):
        """
        Turn class fields into json.

        :return: The json formatted fields.
        """
        return {'id': self.id, 'name': self.name, 'description': self.description}


def create_project(name: str, description: str = '') -> Project:
    """
    Create a project and add it to the database.

    :param name: The project name.
    :param description: The project description.
    :return: The created project.
    """
    project = Project(name=name, description=description)
    db.session.add(project)
    db.session.commit()

    return project


def list_projects() -> []:
    """
    Fetch and return a list of all existing projects.

    :return: The fetched project list.
    """
    project_list = Project.query.all()
    return project_list


project_api = Blueprint('Project API', __name__)


@project_api.route('/projects', methods=['POST'])
def post_projects():
    """
    Provide a POST API endpoint for creating projects.

    :return: The response for creating a project.
    """
    try:
        json_data = request.get_json()
        description = json_data['description'] if 'description' in json_data else ''
        project = create_project(name=json_data['name'], description=description)

        return Response(status='201 Created', headers={'Location': f'/project/{project.id}'})
    except KeyError as error:
        return Response(response=f"Missing data: {', '.join(error.args)}", status='422 Unprocessable Entity')
    except TypeError as error:
        return Response(response="Format: application/json expected", status='400 Bad Request')


@project_api.route('/projects', methods=['GET'])
def get_projects():
    """
    Provide a GET API endpoint for retrieving projects.

    :return: The json-formatted project-list.
    """
    try:
        project_list = list_projects()
        json_project_list = [project.to_json() for project in project_list]
        return jsonify(json_project_list)
    except OperationalError:  # Could not connect to database
        return jsonify('Could not load projects'), 500
    except ProgrammingError:  # Table not found
        return jsonify('Could not load projects'), 500
