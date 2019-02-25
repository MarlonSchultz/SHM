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


def retrieve_project(id: int) -> Project:
    """
    Retrieve and return the project matching <id>

    :param id: The project to retrieve.
    :return: The retrieved project.
    """
    return Project.query.filter_by(id=id).first()


def update_project(id: int, name: str = None, description: str = None) -> Project or None:
    """
    Update an existing project's fields.

    :param id: The id of the project to update.
    :param name: The new name of the project to update.
    :param description: The new description of the project to update.
    :return: The updated project.
    """
    try:
        project = Project.query.get(id)

        if not name:
            raise KeyError('Name must not be empty')

        project.name = name
        project.description = description if description is not None else project.description

        db.session.commit()

        return project
    except AttributeError:
        raise OperationalError(f"Could not load project with id {id}", {}, '')
    except TypeError:
        return None


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
    except TypeError:
        return Response(response="Format: application/json expected", status='400 Bad Request')
    except OperationalError:  # Could not connect to database
        return jsonify('Could not load projects'), 500
    except ProgrammingError:  # Table not found
        return jsonify('Could not load projects'), 500


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


@project_api.route('/project/<id>', methods=['GET'])
def get_project(id):
    """
    Provide a GET API endpoint for retrieving a specific project.

    :param id: The id of the project to be retrieved.
    :return: The json-formatted project information.
    """
    try:
        project = retrieve_project(id)
        return jsonify(project.to_json())
    except AttributeError:
        return Response(response='Project not found', status='404 Not Found')
    except OperationalError:  # Could not connect to database
        return jsonify('Could not load projects'), 500
    except ProgrammingError:  # Table not found
        return jsonify('Could not load projects'), 500


@project_api.route('/project/<id>', methods=['POST'])
def update_existing_project(id: int):
    """
    Provide a POST API endpoint for updating a specific project.

    :param id: The id of the project to be updated.
    :return: Response indicating the update's success.
    """
    try:
        json_data = request.get_json()
        if json_data is None:
            raise TypeError
        if not json_data:
            raise KeyError

        name = json_data['name'] if 'name' in json_data else None
        description = json_data['description'] if 'description' in json_data else None
        project = update_project(id=id, name=name, description=description)

        return Response(status='201 Created', headers={'Location': f'/project/{project.id}'})
    except KeyError as error:
        return Response(response=f"Missing data: {', '.join(error.args)}", status='422 Unprocessable Entity')
    except TypeError as error:
        return Response(response="Format: application/json expected", status='400 Bad Request')
    except OperationalError:  # Could not connect to database
        return jsonify('Could not find project'), 500
    except ProgrammingError:  # Table not found
        return jsonify('Could not find project'), 500
