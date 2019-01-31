from flask import Flask
from werkzeug.wrappers import Response

app = Flask(__name__)


@app.route('/')
def health_check():
    return 'alive'


@app.route('/projects', methods=['POST'])
def projects():
    return Response(status='201 Created', headers={'Location': '/project/1'})


if __name__ == '__main__':
    app.run(debug=True)
