import React, { Component } from 'react';
import { Project } from 'actions/projects';
import ProjectInput from "../ProjectInput/ProjectInput";
import {Route, RouteComponentProps, Switch} from "react-router";
import {Link} from "react-router-dom";

interface Props extends RouteComponentProps {
    project?: Project,
    onUpdate: (id: number, name: string, description?: string) => void;

}

class ProjectView extends Component<Props> {

    updateProject = (name: string, description?: string) => {
        if (this.props.project && this.props.project.id) {
            this.props.onUpdate (this.props.project.id, name, description);
        }
    };

    render() {
        const { match, project } = this.props;
        if (!project) {
            return (<div>No data</div>);
        }

        return (
            <Switch>
                <Route path={`${match.path}`} exact render={() => (
                    <div>
                        <h1>#{project.id} {project.name} <Link to={`${match.url}/edit`}>🖋️</Link></h1>
                        <p>{project.description}</p>
                    </div>
                )} />
                <Route path={`${match.path}/edit`} render={() => (
                    <div>
                        <Link to={`${match.url}`}>Back</Link>
                        <ProjectInput name={this.props.project ? this.props.project.name : ''} description={this.props.project ? this.props.project.description : ''} onSave={this.updateProject}/>
                    </div>
                )} />
            </Switch>
        );
    };
}

export default ProjectView;