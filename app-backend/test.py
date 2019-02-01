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

    @mock.patch("app.project.create_project")
    def test_create_simple_project_endpoint(self, mock_create_project):
        name = "Simple Endpoint Project"
        description = "This is a simple project."

        mock_create_project.return_value = app.project.Project(id=1, name=name, description=description)

        response = self.tester.post('/projects', json={
            'name': name, 'description': description
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn(member='Location', container=response.headers)

    @mock.patch("app.project.create_project")
    def test_create_project(self, mock_create_project):
        name = "Simple Create Project"
        description = "This is a simple project."

        mock_create_project.return_value = app.project.Project(id=1, name=name, description=description)

        project = app.project.create_project(name, description)
        self.assertEqual(project.name, name)
        self.assertEqual(project.description, description)
        self.assertIsNotNone(project.id)


if __name__ == '__main__':
    unittest.main()
