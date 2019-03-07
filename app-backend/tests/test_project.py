from sqlalchemy.exc import OperationalError, ProgrammingError

from app import app_object
from unittest import mock

import unittest
import app


# # #  Helper Functions & Classes  # # #

def _db_session_add_side_effect(project):
    project.id = 1
    return project


class MockDatabaseModelResult:

    def __init__(self):
        self.results = []

    def first(self):
        return self.results[0]


# # #  Test Cases  # # #
def _raise_operational_error(*args, **kwargs):
    raise OperationalError('', {}, '')


def _raise_programming_error(*args, **kwargs):
    raise ProgrammingError('', {}, '')


def _raise_type_error(*args, **kwargs):
    raise TypeError()


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
        response = self.tester.post('/projects', data=dict(
            name=self.name,
            description=self.description
        ))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, b'Format: application/json expected')

    @mock.patch("app.project.create_project")
    def test_retrieve_project_list_endpoint_no_database(self, mock_create_project):
        mock_create_project.side_effect = _raise_operational_error
        response = self.tester.post('/projects', json={
            'name': self.name,
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not load projects')

    @mock.patch("app.project.create_project")
    def test_retrieve_project_list_endpoint_no_table(self, mock_create_project):
        mock_create_project.side_effect = _raise_programming_error
        response = self.tester.post('/projects', json={
            'name': self.name,
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not load projects')


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
        mock_list_projects.side_effect = _raise_operational_error
        response = self.tester.get('/projects', content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not load projects')

    @mock.patch("app.project.list_projects")
    def test_retrieve_project_list_endpoint_no_table(self, mock_list_projects):
        mock_list_projects.side_effect = _raise_programming_error
        response = self.tester.get('/projects', content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not load projects')


class ProjectViewTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)
        self.mock_project = app.project.Project(id=1, name="Eins", description="Das Erste")

    @mock.patch("app.project.Project")
    def test_retrieve_project(self, mock_project_model):
        mock_project_result = MockDatabaseModelResult()
        mock_project_result.results = [self.mock_project]

        mock_project_model.query.filter_by.return_value = mock_project_result
        project = app.project.retrieve_project(1)

        self.assertEqual(project.id, self.mock_project.id)
        self.assertEqual(project.name, self.mock_project.name)
        self.assertEqual(project.description, self.mock_project.description)

    @mock.patch("app.project.Project")
    def test_retrieve_project_not_found(self, mock_project_model):
        mock_project_result = MockDatabaseModelResult()
        mock_project_result.results = [None]

        mock_project_model.query.filter_by.return_value = mock_project_result
        project = app.project.retrieve_project(100000)

        self.assertEqual(project, None)

    @mock.patch("app.project.retrieve_project")
    def test_retrieve_project_endpoint(self, mock_retrieve_project):
        mock_retrieve_project.return_value = self.mock_project
        response = self.tester.get('/project/1', content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, self.mock_project.to_json())

    @mock.patch("app.project.retrieve_project")
    def test_retrieve_project_endpoint_not_found(self, mock_retrieve_project):
        mock_retrieve_project.return_value = None
        response = self.tester.get('/project/10000', content_type='application/json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, b'Project not found')

    @mock.patch("app.project.retrieve_project")
    def test_retrieve_project_endpoint_no_database(self, mock_retrieve_project):
        mock_retrieve_project.side_effect = _raise_operational_error
        response = self.tester.get('/project/1', content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not load projects')

    @mock.patch("app.project.retrieve_project")
    def test_retrieve_project_list_endpoint_no_table(self, mock_retrieve_project):
        mock_retrieve_project.side_effect = _raise_programming_error
        response = self.tester.get('/project/1', content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not load projects')


class ProjectUpdateTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)
        self.mock_project = app.project.Project(id=1, name="Eins", description="Das Erste")
        self.project_id = 1
        self.project_name = "Zwei"
        self.project_description = "Das Zweite"

    @mock.patch("app.project.Project")
    @mock.patch("app.db.session.commit")
    def test_update_project_all_values(self, mock_db_session_commit, mock_project_model):
        mock_project_model.query.get.return_value = self.mock_project
        project = app.project.update_project(self.project_id, self.project_name, self.project_description)

        self.assertEqual(project.id, self.project_id)
        self.assertEqual(project.name, self.project_name)
        self.assertEqual(project.description, self.project_description)

    @mock.patch("app.project.Project")
    @mock.patch("app.db.session.commit")
    def test_update_project_empty_name(self, mock_db_session_commit, mock_project_model):
        mock_project_model.query.get.return_value = self.mock_project
        self.assertRaises(KeyError, app.project.update_project, 1, '', 'Description')

    @mock.patch("app.project.Project")
    @mock.patch("app.db.session.commit")
    def test_update_project_empty_description(self, mock_db_session_commit, mock_project_model):
        mock_project_model.query.get.return_value = self.mock_project
        project = app.project.update_project(self.project_id, self.project_name, '')

        self.assertEqual(project.id, self.project_id)
        self.assertEqual(project.name, self.project_name)
        self.assertEqual(project.description, "")

    @mock.patch("app.project.Project")
    @mock.patch("app.db.session.commit")
    def test_update_project_wrong_id_type(self, mock_db_session_commit, mock_project_model):
        mock_project_model.query.get.side_effect = _raise_type_error
        project = app.project.update_project(None, 'Name', 'Desc')

        self.assertIsNone(project)

    @mock.patch("app.project.Project")
    @mock.patch("app.db.session.commit")
    def test_update_project_wrong_or_unknown_project(self, mock_db_session_commit, mock_project_model):
        mock_project_model.query.get.return_value = None
        self.assertRaises(OperationalError, app.project.update_project, 123123123, 'Name', 'Desc')

    @mock.patch("app.project.update_project")
    def test_update_project_endpoint(self, mock_update_project):
        mock_update_project.return_value = app.project.Project(id=self.project_id, name=self.project_name,
                                                               description=self.project_description)

        response = self.tester.post(f'/project/{self.project_id}', json={
            'name': self.project_name, 'description': self.project_description
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn(member='Location', container=response.headers)
        self.assertEqual(response.headers['Location'], f'http://localhost/project/{self.project_id}')

    @mock.patch("app.project.update_project")
    def test_update_project_endpoint_empty_json(self, mock_update_project):
        response = self.tester.post(f'/project/{self.project_id}', json={})

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.data, b'Missing data: ')

    @mock.patch("app.project.update_project")
    def test_update_project_endpoint_no_json(self, mock_update_project):
        response = self.tester.post(f'/project/{self.project_id}', data=dict(
            name=self.project_name,
            description=self.project_description
        ))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, b'Format: application/json expected')

    @mock.patch("app.project.update_project")
    def test_update_project_endpoint_no_database(self, mock_update_project):
        mock_update_project.side_effect = _raise_operational_error
        response = self.tester.post(f'/project/{self.project_id}', json={
            'name': self.project_name, 'description': self.project_description
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not find project')

    @mock.patch("app.project.update_project")
    def test_update_project_endpoint_no_table(self, mock_update_project):
        mock_update_project.side_effect = _raise_programming_error
        response = self.tester.post(f'/project/{self.project_id}', json={
            'name': self.project_name, 'description': self.project_description
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.is_json, True)
        self.assertEqual(response.json, 'Could not find project')


if __name__ == '__main__':
    unittest.main()
