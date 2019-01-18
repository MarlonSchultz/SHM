from flask import Flask, jsonify, request, abort

app = Flask(__name__)


@app.route('/')
def health_check():
    return 'alive'


if __name__ == '__main__':
    app.run(debug=True)
