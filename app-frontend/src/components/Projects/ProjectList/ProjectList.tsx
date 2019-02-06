import React, { Component } from 'react';
import { Project } from 'actions/projects'

type Props = {
    projects: Project[],
};

class ProjectList extends Component<Props> {

    render() {
        let items : any = [];
        for(let project of this.props.projects) {
            items.push(<li key={project.id}>#{project.id} {project.name}</li>)
        }

        return (
            <ul>
                {items}
            </ul>
        );
    }
}

export default ProjectList;
