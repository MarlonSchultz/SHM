import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { getProjects, addProject, Project } from 'actions/projects'
import ProjectInput from 'components/Projects/ProjectInput/ProjectInput'
import ProjectList from 'components/Projects/ProjectList/ProjectList';

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
        </header>
        <div>
          <ProjectInput onSave={this.saveProject} />
          <ProjectList projects={this.state.projects} />
        </div>
      </div>
    );
  }
}

export default App;
