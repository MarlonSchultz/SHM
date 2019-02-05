from app import app_object
from unittest import mock

import unittest
import app


class BasicTestCase(unittest.TestCase):

    def test_index(self):
        tester = app_object.test_client(self)
        response = tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)


class ProjectCreationTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)
        self.name = "Simple Project (Create/Endpoint)"
        self.description = "This is a simple project creation / endpoint test."

    @mock.patch("app.project.create_project")
    def test_create_project(self, mock_create_project):
        mock_create_project.return_value = app.project.Project(id=1, name=self.name, description=self.description)
        project = app.project.create_project(self.name, self.description)

        self.assertEqual(project.name, self.name)
        self.assertEqual(project.description, self.description)
        self.assertIsNotNone(project.id)

    @mock.patch("app.project.create_project")
    def test_create_simple_project_endpoint(self, mock_create_project):
        mock_create_project.return_value = app.project.Project(id=1, name=self.name, description=self.description)
        response = self.tester.post('/projects', json={
            'name': self.name, 'description': self.description
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn(member='Location', container=response.headers)


class ProjectListRetrievalTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app_object.test_client(self)
        self.mock_project_list = [
            app.project.Project(id=1, name="Eins", description="Das Erste")
        ]

    @mock.patch("app.project.list_projects")
    def test_retrieve_project_list(self, mock_list_projects):
        mock_list_projects.return_value = self.mock_project_list
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


if __name__ == '__main__':
    unittest.main()
