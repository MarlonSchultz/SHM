from unittest import mock
from app import app_object

import app
import unittest


class MockDatabaseModelResult:

    def __init__(self):
        self.results = []

    def all(self):
        return self.results


def _db_session_add_side_effect(comment: app.comment.Comment):
    comment.id = 1
    return comment


class CommentCreationTestCase(unittest.TestCase):

    def setUp(self):
        self.stakeholder_id = 1
        self.user_id = 1
        self.comment_text = "Dies ist ein Kommentar"

    @mock.patch("app.db.session.add")
    @mock.patch("app.db.session.commit")
    def test_create_comment(self, mock_db_session_commit, mock_db_session_add):
        mock_db_session_add.side_effect = _db_session_add_side_effect
        comment = app.comment.create_comment(self.comment_text, self.stakeholder_id, self.user_id)

        self.assertEqual(comment.stakeholder_id, self.stakeholder_id)
        self.assertEqual(comment.user_id, self.user_id)
        self.assertEqual(comment.text, self.comment_text)
        self.assertEqual(comment.id, 1)


class CommentListRetrievalTestCase(unittest.TestCase):

    def setUp(self):
        self.mock_comment = app.comment.Comment(id=1, text="Mein Kommentar", stakeholder_id=1, user_id=1)

    @mock.patch("app.comment.Comment")
    def test_retrieve_comment_list(self, mock_comment_model):
        mock_comment_result = MockDatabaseModelResult()
        mock_comment_result.results = [self.mock_comment, self.mock_comment]

        mock_comment_model.query.filter_by.return_value = mock_comment_result
        comment_list = app.comment.list_comments(stakeholder=1, user=1)

        self.assertEqual(len(comment_list), 2)
        self.assertEqual(comment_list, [self.mock_comment, self.mock_comment])
