import React, { Component } from 'react';
import { Project } from 'actions/projects'
import { Link } from 'react-router-dom';

type Props = {
    projects: Project[],
};

class ProjectList extends Component<Props> {

    render() {
        let items : any = [];
        for(let project of this.props.projects) {
            items.push(<li key={project.id}><Link to={`/project/${project.id}`}>#{project.id} {project.name}</Link> <Link to={`/project/${project.id}/edit`}>🖋️</Link></li>)
        }

        return (
            <ul>
                {items}
            </ul>
        );
    }
}

export default ProjectList;
