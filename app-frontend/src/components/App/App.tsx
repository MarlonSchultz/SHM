import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { getProjects, addProject, Project } from 'actions/projects'
import ProjectsOverview from 'components/Projects/ProjectsOverview/ProjectsOverview'
import { Link, Route, Switch } from 'react-router-dom';
import ProjectView from "../Projects/ProjectView/ProjectView";

type State = {
  projects: Project[],
};

type Props = {

};

class App extends Component<Props, State> {

  state = {
    projects: Array<Project>(),
  };

  componentDidMount() {
    getProjects().then((projects) => {
      this.setState({ projects: projects });
    });
  }

  saveProject = (name: string, description?: string) => {
    addProject(name, description).then((result) => {
      getProjects().then((projects) => {
        this.setState({ projects: projects });
      });
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
              <ProjectsOverview projects={this.state.projects} onSave={this.saveProject} />
            )} />
          <Route path="/project/:number" render={(props) => (
              <ProjectView project={
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

export default App;
