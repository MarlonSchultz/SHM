import { addProject, getProjects, updateProject as projectAPIUpdate, Project } from 'actions/projects';
import ProjectsOverview from 'components/Projects/ProjectsOverview/ProjectsOverview';
import React, { Component } from 'react';
import { withRouter, Link, Route, RouteComponentProps, Switch } from 'react-router-dom';
import ProjectView from '../Projects/ProjectView/ProjectView';
import logo from './logo.svg';
import './App.css';

interface State {
  projects: Project[];
}

interface Props extends RouteComponentProps {

}

class App extends Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  public componentDidMount(): void {
    getProjects().then((projects: Project[]) => {
      this.setState({ projects });
    });
  }

  public createProject = (name: string, description?: string) => {
    addProject({name, description}).then(() => {
      getProjects().then((projects: Project[]) => {
        this.setState({ projects });
      });
    });
  }

  public updateProject = (project: Project) => {
      projectAPIUpdate(project).then((result: Project) => {
          this.setState((prevState: State) => {
              const projects = prevState.projects.map((p: Project) => p.id === result.id ?  result : p);
              return { projects };
          });
      }).then(() => {
          this.props.history.push(`/project/${project.id}`);
      });
  }

  public render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Stegholder Mähp</h1>
          <ul>
              <li><Link to="/">Home</Link></li>
          </ul>
        </header>
        <Switch>
          <Route
            path="/"
            exact={true}
            render={() => (
              <ProjectsOverview projects={this.state.projects} onSave={this.createProject} />
            )}
          />
          <Route
            path="/project/:number"
            render={(props: RouteComponentProps<{number: string}>) => (
              <ProjectView
                {...props}
                onUpdate={this.updateProject}
                project={
                  this.state.projects.filter((project: Project) =>
                    project.id! === parseInt(props.match.params.number, 10))[0]
                }
              />
          )}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
