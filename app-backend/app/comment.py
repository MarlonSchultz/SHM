from app import db


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text(), unique=False, nullable=False)
    stakeholder_id = db.Column(db.Integer, db.ForeignKey('stakeholder.id'), nullable=False)
    user_id = db.Column(db.Integer, nullable=False, default=1)


def create_comment(text: str, stakeholder_id: int, user_id: int) -> Comment:
    comment = Comment(text=text, stakeholder_id=stakeholder_id, user_id=user_id)
    db.session.add(comment)
    db.session.commit()

    return comment


def list_comments(stakeholder: int, user: int):
    comment_list = Comment.query.filter_by(stakeholder_id=stakeholder, user_id=user).all()
    return comment_list
