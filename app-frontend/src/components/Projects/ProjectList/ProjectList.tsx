import { Project } from 'actions/projects';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    projects: Project[];
}

class ProjectList extends Component<Props> {

    public render(): JSX.Element {
        const items: JSX.Element[] = [];
        for (const project of this.props.projects) {
            items.push(
            <li key={project.id}>
                <Link to={`/project/${project.id}`}>#{project.id} {project.name}</Link>
                <Link to={`/project/${project.id}/edit`}>🖋️</Link>
            </li>);
        }

        return (
            <ul>
                {items}
            </ul>
        );
    }
}

export default ProjectList;
