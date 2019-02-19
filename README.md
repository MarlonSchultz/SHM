# SHM
## Application Structure
The StakeHolderMap (SHM) uses a headless CMS approach, utilizing Python 3.6 and Flask.  
For the Frontend TypeScript and ReactJs are used.  
There are 4 different Docker Containers:

**python-uwsgi**  
The flask application bundled with a uWSGI server as middleware to allow communication between flask and Nginx.  
The uWSGI server is available on port `8080` (but unable to comprehend http requests with its current setup)
 
**python-nginx**  
The Nginx server which handles requests from the frontend and passes them to the uWSGI server.  
The Nginx server is available via `localhost:8081` and should respond with `alive`, the health check.
 
**tyepscript-nginx**  
The Nginx server which handles requests from the outside world.  
The Nginx server is available via `localhost:8082` and should respond with the ReactJS demo page.
 
**adminer**
Database management webtool. Open localhost:8080 to connect to database. Use credentials from database.conf

**postgres**  
The PostgreSQL database is available via port `5432`.

## Docker
### Dockerfiles
The Dockerfiles are set up to avoid having build dependencies / files in the final docker image.

### Docker Compose
The project uses docker-compose for the local stack. Relevant commands:

```bash
docker-compose build  
docker-compose up -d  
docker-compose stop
```
 
## BackEnd Development
### Virtual Environment
To keep dependencies between python applications clean, it is recommended to use python virtual environments. To install `virtualenv`, run the following command:
 
```bash
sudo pip3 install virtualenv
```
 
`sudo` is required so the flask binary is available system-wide. Installing in user-space requires you to add the binary manually to your path. `virtualenv` might also be available as a package provided by your linux distribution.  
Once `virtualenv` is installed, head to `./app-backend`. Inside execute the following commands:
 
```bash
virtualenv venv  
source venv/bin/activate
```
 
This will activate the virtual environment and set PATHs appropriately for the current terminal session. To deactivate use the command `deactivate`.  
Once the virtual environment is activated, you can start installing dependencies via `pip3`. To get started, execute the following command:

```bash
pip3 install -r requirements.txt
```

This will install all existing dependencies for the project. When you add new dependencies update the requirements.txt with the following command:

```bash
pip3 freeze > requirements.txt
```

### Development Server
If you don't need the full stack for your development, you can use flask's development server. To start it, run the following shell script (with your virtual environment activated):

```bash
./debug_server.sh
```

The development server is available on `127.0.0.1:5000` by default.

### Database Migrations
To setup your database enter the docker container `python-uwsgi`, change to the `/shm` directory and execute the command `flask db upgrade`.  
If you need to create a new migration, use the command `flask db migrate`. For further documentation see https://flask-migrate.readthedocs.io/en/latest/

### Resources
Flask: http://flask.pocoo.org/docs/1.0/quickstart/  
SQLAlchemy: https://www.pythoncentral.io/introductory-tutorial-python-sqlalchemy/  
Flask SQLAlchemy: http://flask-sqlalchemy.pocoo.org/2.3/quickstart/  
Flask Migrate: https://flask-migrate.readthedocs.io/en/latest/  
Flask TDD: https://github.com/mjhea0/flaskr-tdd  
Flask Mocking Part #1: https://medium.com/python-pandemonium/python-mocking-you-are-a-tricksy-beast-6c4a1f8d19b2  
Flask Mocking Part #2: https://medium.com/python-pandemonium/surrender-python-mocking-i-have-you-now-5805e91cfbf4

## FrontEnd Development
Insert info
