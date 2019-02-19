import React, { Component } from 'react';
import { Project } from 'actions/projects';
import ProjectInput from 'components/Projects/ProjectInput/ProjectInput'
import ProjectList from 'components/Projects/ProjectList/ProjectList';

type Props = {
    projects: Project[],
    onSave: (name: string,description?: string) => void,
};

class ProjectsOverview extends Component<Props> {

    render() {
        return (
            <div>
                <ProjectInput onSave={this.props.onSave} />
                <ProjectList projects={this.props.projects} />
            </div>
        );
    };
}

export default ProjectsOverview;
