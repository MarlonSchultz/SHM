import { Project } from 'actions/projects';
import ProjectInput from 'components/Projects/ProjectInput/ProjectInput';
import ProjectList from 'components/Projects/ProjectList/ProjectList';
import React, { Component } from 'react';

interface Props {
    projects: Project[];
    onSave: (name: string, description?: string) => void;
}

class ProjectsOverview extends Component<Props> {

    public render(): JSX.Element {
        return (
            <div>
                <ProjectInput onSave={this.props.onSave} />
                <ProjectList projects={this.props.projects} />
            </div>
        );
    }
}

export default ProjectsOverview;
