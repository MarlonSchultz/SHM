import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { getProjects, addProject, updateProject as projectAPIUpdate, Project } from 'actions/projects'
import ProjectsOverview from 'components/Projects/ProjectsOverview/ProjectsOverview'
import { Link, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import ProjectView from "../Projects/ProjectView/ProjectView";

type State = {
  projects: Project[],
};

interface Props extends RouteComponentProps {

}

class App extends Component<Props, State> {

  state = {
    projects: Array<Project>(),
  };

  componentDidMount() {
    getProjects().then((projects) => {
      this.setState({ projects: projects });
    });
  }

  createProject = (name: string, description?: string) => {
    addProject(name, description).then((result) => {
      getProjects().then((projects) => {
        this.setState({ projects: projects });
      });
    });
  };

  updateProject = (id: number, name: string, description?: string) => {
      projectAPIUpdate(id, name, description).then((result) => {
          this.setState((prevState, props) => {
              let projects = prevState.projects.map(p => p.id === result.id ?  result : p );
              return { projects: projects };
          });
      }).then((result) => {
          this.props.history.push(`/project/${id}`);
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Stegholder Mähp</h1>
          <ul>
              <li><Link to="/">Home</Link></li>
          </ul>
        </header>
        <Switch>
          <Route path="/" exact render={() => (
              <ProjectsOverview projects={this.state.projects} onSave={this.createProject} />
            )} />
          <Route path="/project/:number" render={(props) => (
              <ProjectView {...props} onUpdate={this.updateProject} project={
                this.state.projects.filter((project) => {
                  return project.id == parseInt(props.match.params.number, 10)
                })[0]
              }/>
          )} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
