import React, { Component } from 'react';
import { Project } from 'actions/projects';

type Props = {
    project?: Project,
};

class ProjectView extends Component<Props> {

    render() {
        if (!this.props.project) {
            return (<div>No data</div>);
        }

        return (
            <div>
                <h1>#{this.props.project.id} {this.props.project.name}</h1>
                <p>{this.props.project.description}</p>
            </div>
        );
    };
}

export default ProjectView;