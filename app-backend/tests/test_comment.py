from unittest import mock
from sqlalchemy.exc import OperationalError, ProgrammingError
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


def _raise_operational_error(*args, **kwargs):
    raise OperationalError('', {}, '')


def _raise_programming_error(*args, **kwargs):
    raise ProgrammingError('', {}, '')


def _raise_type_error(*args, **kwargs):
    raise TypeError()


class CommentCreationTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)
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

    @mock.patch("app.comment.create_comment")
    def test_create_comment_endpoint(self, mock_create_comment):
        mock_create_comment.return_value = app.comment.Comment(text=self.comment_text,
                                                               stakeholder_id=self.stakeholder_id,
                                                               user_id=self.user_id)

        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment', json={
            'text': self.comment_text,
            'user_id': 1,
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn(member='Location', container=response.headers)

    @mock.patch("app.comment.create_comment")
    def test_create_comment_endpoint_missing_text(self, mock_create_comment):
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment', json={
            'user_id': 1,
        })

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.data, b'Missing data: text')

    @mock.patch("app.comment.create_comment")
    def test_create_comment_endpoint_missing_user_id(self, mock_create_comment):
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment', json={
            'text': self.comment_text,
        })

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.data, b'Missing data: user_id')

    @mock.patch("app.comment.create_comment")
    def test_create_comment_endpoint_no_json(self, mock_create_comment):
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment', data=dict(
            text=self.comment_text,
            user_id=self.user_id
        ))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, b'Format: application/json expected')

    @mock.patch("app.comment.create_comment")
    def test_create_comment_endpoint_empty_json(self, mock_create_comment):
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment', json={})

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.data, b'Missing data: text')

    @mock.patch("app.comment.create_comment")
    def test_create_comment_endpoint_no_database(self, mock_create_comment):
        mock_create_comment.side_effect = _raise_operational_error
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment', json={
            'text': self.comment_text,
            'user_id': self.user_id,
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not find comment')

    @mock.patch("app.comment.create_comment")
    def test_create_comment_endpoint_no_table(self, mock_create_comment):
        mock_create_comment.side_effect = _raise_programming_error
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment', json={
            'text': self.comment_text,
            'user_id': self.user_id,
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not find comment')


class CommentListRetrievalTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)
        self.mock_comment = app.comment.Comment(id=1, text="Mein Kommentar", stakeholder_id=1, user_id=1)

    @mock.patch("app.comment.Comment")
    def test_retrieve_comment_list(self, mock_comment_model):
        mock_comment_result = MockDatabaseModelResult()
        mock_comment_result.results = [self.mock_comment, self.mock_comment]

        mock_comment_model.query.filter_by.return_value = mock_comment_result
        comment_list = app.comment.list_comments(stakeholder=1, user=1)

        self.assertEqual(len(comment_list), 2)
        self.assertEqual(comment_list, [self.mock_comment, self.mock_comment])

    @mock.patch("app.comment.Comment")
    def test_retrieve_comment_list_empty(self, mock_comment_model):
        mock_comment_result = MockDatabaseModelResult()
        mock_comment_result.results = []

        mock_comment_model.query.filter_by.return_value = mock_comment_result
        comment_list = app.comment.list_comments(stakeholder=1000000, user=9999)

        self.assertEqual(comment_list, [])

    @mock.patch("app.comment.list_comments")
    def test_retrieve_comment_list_endpoint(self, mock_list_comments):
        mock_list_comments.return_value = [self.mock_comment]
        response = self.tester.get('/project/1/stakeholder/1/comment', content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, [self.mock_comment.to_json()])

    @mock.patch("app.comment.list_comments")
    def test_retrieve_comment_list_endpoint_no_database(self, mock_list_comments):
        mock_list_comments.side_effect = _raise_operational_error
        response = self.tester.get('/project/1/stakeholder/1/comment', content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not find comments')

    @mock.patch("app.comment.list_comments")
    def test_retrieve_comment_list_endpoint_no_table(self, mock_list_comments):
        mock_list_comments.side_effect = _raise_programming_error
        response = self.tester.get('/project/1/stakeholder/1/comment', content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not find comments')


class CommentUpdateTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)
        self.mock_comment = app.comment.Comment(id=1, text="Text", stakeholder_id=1, user_id=1)

        self.comment_id = 1
        self.stakeholder_id = 2
        self.user_id = 2
        self.text = "Updated Text"

    @mock.patch("app.comment.Comment")
    @mock.patch("app.db.session.commit")
    def test_update_comment_all_values(self, mock_db_session_commit, mock_comment_model):
        mock_comment_model.query.get.return_value = self.mock_comment
        comment = app.comment.update_comment(id=self.comment_id, text=self.text, stakeholder_id=self.stakeholder_id,
                                             user_id=self.user_id)

        self.assertEqual(comment.id, self.comment_id)
        self.assertEqual(comment.text, self.text)
        self.assertEqual(comment.stakeholder_id, self.stakeholder_id)
        self.assertEqual(comment.user_id, self.user_id)

    @mock.patch("app.comment.Comment")
    @mock.patch("app.db.session.commit")
    def test_update_comment_invalid_stakeholder_id(self, mock_db_session_commit, mock_comment_model):
        mock_comment_model.query.get.return_value = self.mock_comment

        self.assertRaises(KeyError, app.comment.update_comment, 1, 'Updated Text', stakeholder_id=0, user_id=1)
        self.assertRaises(KeyError, app.comment.update_comment, 1, 'Updated Text', stakeholder_id=-102, user_id=1)
        self.assertRaises(KeyError, app.comment.update_comment, 1, 'Updated Text', stakeholder_id='wurst', user_id=1)

    @mock.patch("app.comment.Comment")
    @mock.patch("app.db.session.commit")
    def test_update_comment_invalid_user_id(self, mock_db_session_commit, mock_comment_model):
        mock_comment_model.query.get.return_value = self.mock_comment

        self.assertRaises(KeyError, app.comment.update_comment, 1, 'Updated Text', stakeholder_id=1, user_id=0)
        self.assertRaises(KeyError, app.comment.update_comment, 1, 'Updated Text', stakeholder_id=1, user_id=-222)
        self.assertRaises(KeyError, app.comment.update_comment, 1, 'Updated Text', stakeholder_id=1, user_id='käse')

    @mock.patch("app.comment.Comment")
    @mock.patch("app.db.session.commit")
    def test_update_comment_wrong_id_type(self, mock_db_session_commit, mock_comment_model):
        mock_comment_model.query.get.side_effect = _raise_type_error
        comment = app.comment.update_comment(None, 'Updated Text', stakeholder_id=1, user_id=1)

        self.assertIsNone(comment)

    @mock.patch("app.comment.Comment")
    @mock.patch("app.db.session.commit")
    def test_update_comment_wrong_or_unknown_comment(self, mock_db_session_commit, mock_comment_model):
        mock_comment_model.query.get.return_value = None
        self.assertRaises(OperationalError, app.comment.update_comment, 123123123, 'Updated Text', stakeholder_id=1,
                          user_id=1)

    @mock.patch("app.comment.update_comment")
    def test_update_comment_endpoint(self, mock_update_comment):
        mock_update_comment.return_value = app.comment.Comment(id=self.comment_id,
                                                               text=self.text,
                                                               stakeholder_id=self.stakeholder_id,
                                                               user_id=self.user_id)

        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment/{self.comment_id}', json={
            'text': self.text,
            'user_id': self.user_id,
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn(member='Location', container=response.headers)
        self.assertEqual(response.headers['Location'], f'http://localhost/project/1/stakeholder/{self.stakeholder_id}/comment/{self.comment_id}')

    @mock.patch("app.comment.update_comment")
    def test_update_comment_endpoint_empty_json(self, mock_update_comment):
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment/{self.comment_id}', json={})

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.data, b'Missing data: text')

    @mock.patch("app.comment.update_comment")
    def test_update_comment_endpoint_no_json(self, mock_update_comment):
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment/{self.comment_id}', data=dict(
            text=self.text,
            user_id=self.user_id,
        ))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, b'Format: application/json expected')

    @mock.patch("app.comment.update_comment")
    def test_update_comment_endpoint_no_database(self, mock_update_comment):
        mock_update_comment.side_effect = _raise_operational_error
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment/{self.comment_id}', json={
            'text': self.text,
            'user_id': self.user_id
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not find comment')

    @mock.patch("app.comment.update_comment")
    def test_update_comment_endpoint_no_table(self, mock_update_comment):
        mock_update_comment.side_effect = _raise_programming_error
        response = self.tester.post(f'/project/1/stakeholder/{self.stakeholder_id}/comment/{self.comment_id}', json={
            'text': self.text,
            'user_id': self.user_id
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not find comment')
