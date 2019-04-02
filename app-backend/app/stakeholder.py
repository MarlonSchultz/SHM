from flask import Blueprint, request, jsonify
from sqlalchemy.exc import OperationalError, ProgrammingError
from werkzeug.wrappers import Response

from app import db


class Stakeholder(db.Model):
    """
    Stakeholder class.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), unique=False, nullable=False)
    company = db.Column(db.String(300), unique=False, nullable=True)
    role = db.Column(db.String(300), unique=False, nullable=True)
    attitude = db.Column(db.String(300), unique=False, nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    archived = db.Column(db.Boolean(), unique=False, nullable=False, default=False)
    comments = db.relationship('Comment', backref='stakeholder', lazy=True)

    def to_json(self):
        """
        Turn class fields into json.

        :return: The json formatted fields.
        """
        return {'id': self.id, 'name': self.name, 'company': self.company, 'role': self.role, 'attitude': self.attitude,
                'projectId': self.project_id, 'archived': self.archived}


def create_stakeholder(project_id: int, name: str, company: str, role: str, attitude: str) -> Stakeholder:
    """
    Create a stakeholder and add it to the database.

    :param project_id: The project id.
    :param name: Stakeholder name.
    :param company: Stakeholder company name.
    :param role: Stakeholder role.
    :param attitude: Attitude of the stakeholder.
    :return: The created project.
    """
    stakeholder = Stakeholder(project_id=project_id, name=name, company=company, role=role, attitude=attitude)
    db.session.add(stakeholder)
    db.session.commit()

    return stakeholder


def list_stakeholders(project_id: int) -> []:
    """
    Fetch and return a list of all existing projects.

    :return: The fetched project list.
    """
    stakeholder_list = Stakeholder.query.filter_by(project_id=project_id, archived=False).all()
    return stakeholder_list


def update_stakeholder(id: int, name: str = None, company: str = None, role: str = None,
                       attitude: str = None, archived: bool = None) -> Stakeholder or None:
    """
    Provide a POST API endpoint for updating a specific stakeholder.

    :param id: ID of the stakeholder.
    :param name: Name of the stakeholder.
    :param company: Company of the stakeholder.
    :param role: Role of the stakeholder.
    :param attitude: Attitude of the stakeholder.
    :return:
    """
    try:
        stakeholder = Stakeholder.query.get(id)

        if not name:
            raise KeyError('Name must not be empty')

        stakeholder.name = name
        stakeholder.company = company if company is not None else stakeholder.company
        stakeholder.role = role if role is not None else stakeholder.role
        stakeholder.attitude = attitude if attitude is not None else stakeholder.attitude
        stakeholder.archived = archived if archived is not None else stakeholder.archived

        db.session.commit()

        return stakeholder
    except AttributeError:
        raise OperationalError(f"Could not load stakeholder with id {id}", {}, '')
    except TypeError:
        return None


stakeholder_api = Blueprint('Stakeholder API', __name__)


@stakeholder_api.route('/project/<project_id>/stakeholder', methods=['POST'])
def post_stakeholder(project_id: int):
    try:
        json_data = request.get_json()
        company = json_data['company'] if 'company' in json_data else None
        role = json_data['role'] if 'role' in json_data else None
        attitude = json_data['attitude'] if 'attitude' in json_data else None

        stakeholder = create_stakeholder(project_id=project_id, name=json_data['name'], company=company, role=role,
                                         attitude=attitude)

        return Response(status='201 Created',
                        headers={'Location': f'/project/{stakeholder.project_id}/stakeholder/{stakeholder.id}'})
    except KeyError as error:
        return Response(response=f"Missing data: {', '.join(error.args)}", status='422 Unprocessable Entity')
    except TypeError as error:
        return Response(response="Format: application/json expected", status='400 Bad Request')
    except OperationalError:  # Could not connect to database
        return jsonify('Could not find stakeholder'), 500
    except ProgrammingError:  # Table not found
        return jsonify('Could not find stakeholder'), 500


@stakeholder_api.route('/project/<project_id>/stakeholder', methods=['GET'])
def get_stakeholder_list(project_id: int):
    try:
        stakeholder_list = list_stakeholders(project_id)
        json_stakeholder_list = [stakeholder.to_json() for stakeholder in stakeholder_list]
        return jsonify(json_stakeholder_list)
    except OperationalError:  # Could not connect to database
        return jsonify('Could not find stakeholders'), 500
    except ProgrammingError:  # Table not found
        return jsonify('Could not find stakeholders'), 500


@stakeholder_api.route('/project/<project_id>/stakeholder/<stakeholder_id>', methods=['POST'])
def update_existing_stakeholder(project_id: int, stakeholder_id: int):
    try:
        json_data = request.get_json()
        if json_data is None:
            raise TypeError
        if not json_data:
            raise KeyError

        name = json_data['name'] if 'name' in json_data else None
        company = json_data['company'] if 'company' in json_data else None
        role = json_data['role'] if 'role' in json_data else None
        attitude = json_data['attitude'] if 'attitude' in json_data else None
        archived = json_data['archived'] if 'archived' in json_data else None

        stakeholder = update_stakeholder(stakeholder_id, name=name, company=company, role=role, attitude=attitude, archived=archived)

        return Response(status='201 Created',
                        headers={'Location': f'/project/{project_id}/stakeholder/{stakeholder_id}'})
    except KeyError as error:
        return Response(response=f"Missing data: {', '.join(error.args)}", status='422 Unprocessable Entity')
    except TypeError as error:
        return Response(response="Format: application/json expected", status='400 Bad Request')
    except OperationalError:
        return jsonify('Could not find stakeholder'), 500
    except ProgrammingError:
        return jsonify('Could not find stakeholder'), 500
