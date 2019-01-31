from main import app

import unittest


class BasicTestCase(unittest.TestCase):

    def test_index(self):
        tester = app.test_client(self)
        response = tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)


class ProjectCreationTestCase(unittest.TestCase):

    def setUp(self):
        self.tester = app.test_client(self)

    def test_create_simple_project(self):
        response = self.tester.post('/projects', json={
            'name': 'Simple Project', 'description': 'This is a simple sample project.'
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn(member='Location', container=response.headers)


if __name__ == '__main__':
    unittest.main()
