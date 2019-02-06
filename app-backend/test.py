from sqlalchemy.exc import OperationalError, ProgrammingError

from app import app_object
from unittest import mock

import unittest
import app


def _db_session_add_side_effect(project):
    project.id = 1
    return project


def _list_project_raise_operational_error():
    raise OperationalError('', {}, '')


def _list_project_raise_programming_error():
    raise ProgrammingError('', {}, '')


class BasicTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)

    def test_index(self):
        response = self.tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    def test_non_existent_route(self):
        response = self.tester.get('/this-route-does-not-exist', content_type='html/text')
        self.assertEqual(response.status_code, 404)


class ProjectCreationTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)
        self.name = "Simple Project (Create/Endpoint)"
        self.description = "This is a simple project creation / endpoint test."

    @mock.patch("app.db.session.add")
    @mock.patch("app.db.session.commit")
    def test_create_project(self, mock_db_session_commit, mock_db_session_add):
        mock_db_session_add.side_effect = _db_session_add_side_effect
        project = app.project.create_project(self.name, self.description)

        self.assertEqual(project.name, self.name)
        self.assertEqual(project.description, self.description)
        self.assertEqual(project.id, 1)
        assert mock_db_session_add.called
        assert mock_db_session_commit.called

    @mock.patch("app.db.session.add")
    @mock.patch("app.db.session.commit")
    def test_create_project_no_description(self, mock_db_session_commit, mock_db_session_add):
        mock_db_session_add.side_effect = _db_session_add_side_effect
        project = app.project.create_project(self.name)

        self.assertEqual(project.name, self.name)
        self.assertEqual(project.description, '')
        self.assertEqual(project.id, 1)
        assert mock_db_session_add.called
        assert mock_db_session_commit.called

    @mock.patch("app.project.create_project")
    def test_create_simple_project_endpoint(self, mock_create_project):
        mock_create_project.return_value = app.project.Project(id=1, name=self.name, description=self.description)
        response = self.tester.post('/projects', json={
            'name': self.name, 'description': self.description
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn(member='Location', container=response.headers)

    @mock.patch("app.project.create_project")
    def test_create_project_endpoint_missing_name(self, mock_create_project):
        response = self.tester.post('/projects', json={
            'description': self.description
        })

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.data, b'Missing data: name')

    @mock.patch("app.project.create_project")
    def test_create_project_endpoint_missing_description(self, mock_create_project):
        mock_create_project.return_value = app.project.Project(id=1, name=self.name)
        response = self.tester.post('/projects', json={
            'name': self.name
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn(member='Location', container=response.headers)

    @mock.patch("app.project.create_project")
    def test_create_project_endpoint_empty_json(self, mock_create_project):
        response = self.tester.post('/projects', json={})

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.data, b'Missing data: name')

    @mock.patch("app.project.create_project")
    def test_create_project_endpoint_no_json(self, mock_create_project):
        response = self.tester.post('projects', data=dict(
            name=self.name,
            description=self.description
        ))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, b'Format: application/json expected')


class ProjectListRetrievalTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)
        self.mock_project_list = [
            app.project.Project(id=1, name="Eins", description="Das Erste")
        ]

    @mock.patch("app.project.Project")
    def test_retrieve_project_list(self, mock_project_model):
        mock_project_model.query.all.return_value = self.mock_project_list
        project_list = app.project.list_projects()

        self.assertEqual(len(project_list), 1)
        self.assertEqual(project_list, self.mock_project_list)

    @mock.patch("app.project.list_projects")
    def test_retrieve_project_list_endpoint(self, mock_list_projects):
        mock_list_projects.return_value = self.mock_project_list
        mock_json_project_list = [project.to_json() for project in self.mock_project_list]
        response = self.tester.get('/projects', content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, mock_json_project_list)

    @mock.patch("app.project.list_projects")
    def test_retrieve_project_list_endpoint_no_database(self, mock_list_projects):
        mock_list_projects.side_effect = _list_project_raise_operational_error
        response = self.tester.get('/projects', content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not load projects')

    @mock.patch("app.project.list_projects")
    def test_retrieve_project_list_endpoint_no_table(self, mock_list_projects):
        mock_list_projects.side_effect = _list_project_raise_programming_error
        response = self.tester.get('/projects', content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not load projects')


if __name__ == '__main__':
    unittest.main()
