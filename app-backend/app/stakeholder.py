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

    def to_json(self):
        """
        Turn class fields into json.

        :return: The json formatted fields.
        """
        return {'id': self.id, 'name': self.name, 'company': self.company, 'role': self.role, 'attitude': self.attitude}


def create_stakeholder(project_id: int, name: str, company: str, role: str, attitude: str):
    """
    Create a stakeholder and add it to the database.

    :param project_id: The project id.
    :param name: Stakeholder name.
    :param company: Stakeholder company name.
    :param role: Stakeholder role.
    :param attitude: Attitude of the stakeholder.
    :return: The created project.
    """
    stakeholder = Stakeholder(project_id = project_id, name = name, company = company, role = role, attitude = attitude)
    db.session.add(stakeholder)
    db.session.commit()

    return stakeholder


stakeholder_api = Blueprint('Stakeholder API', __name__)


@stakeholder_api.route('/project/<project_id>/stakeholder', methods=['POST'])
def post_stakeholder(project_id: int):
    
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

        stakeholder = create_stakeholder(project_id=project_id, name=name, company=company, role=role, attitude=attitude)

        return Response(status='201 Created', headers={'Location': f'/project/{stakeholder.project_id}/stakeholder/{stakeholder.id}'})
    except KeyError as error:
        return Response(response=f"Missing data: {', '.join(error.args)}", status='422 Unprocessable Entity')
    except TypeError as error:
        return Response(response="Format: application/json expected", status='400 Bad Request')
    except OperationalError:  # Could not connect to database
        return jsonify('Could not find project'), 500
    except ProgrammingError:  # Table not found
        return jsonify('Could not find project'), 500
