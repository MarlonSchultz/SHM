from flask import Blueprint, request, jsonify
from sqlalchemy.exc import OperationalError, ProgrammingError
from werkzeug.wrappers import Response

from app import db


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text(), unique=False, nullable=False)
    stakeholder_id = db.Column(db.Integer, db.ForeignKey('stakeholder.id'), nullable=False)
    user_id = db.Column(db.Integer, nullable=False, default=1)

    def to_json(self):
        return {
            'id': self.id,
            'text': self.text,
            'stakeholder_id': self.stakeholder_id,
            'user_id': self.user_id,
        }


def create_comment(text: str, stakeholder_id: int, user_id: int) -> Comment:
    comment = Comment(text=text, stakeholder_id=stakeholder_id, user_id=user_id)
    db.session.add(comment)
    db.session.commit()

    return comment


def list_comments(stakeholder: int, user: int) -> list:
    comment_list = Comment.query.filter_by(stakeholder_id=stakeholder, user_id=user).all()
    return comment_list


comment_api = Blueprint('Comment API', __name__)


@comment_api.route('/project/<project_id>/stakeholder/<stakeholder_id>/comment', methods=['POST'])
def post_comment(project_id: int, stakeholder_id: int):
    try:
        json_data = request.get_json()
        comment = create_comment(text=json_data['text'], stakeholder_id=stakeholder_id, user_id=json_data['user_id'])

        return Response(status='201 Created',
                        headers={'Location': f'/project/{project_id}/stakeholder/{stakeholder_id}/comment/{comment.id}'})
    except KeyError as error:
        return Response(response=f"Missing data: {', '.join(error.args)}", status='422 Unprocessable Entity')
    except TypeError as error:
        return Response(response="Format: application/json expected", status='400 Bad Request')
    except OperationalError:  # Could not connect to database
        return jsonify('Could not find comment'), 500
    except ProgrammingError:  # Table not found
        return jsonify('Could not find comment'), 500


@comment_api.route('/project/<project_id>/stakeholder/<stakeholder_id>/comment', methods=['GET'])
def get_comment_list(project_id: int, stakeholder_id: int):
    try:
        comment_list = list_comments(stakeholder=stakeholder_id, user=1)
        json_comment_list = [comment.to_json() for comment in comment_list]
        return jsonify(json_comment_list)
    except OperationalError:  # Could not connect to database
        return jsonify('Could not find comments'), 500
    except ProgrammingError:  # Table not found
        return jsonify('Could not find comments'), 500
