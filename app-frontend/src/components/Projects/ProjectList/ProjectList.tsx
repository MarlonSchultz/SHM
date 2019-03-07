import { Project } from 'actions/projects';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Input from 'components/Input/Input';

interface Props {
    projects: Project[];
}

interface State {
    filteredProjects: Project[];
}

class ProjectList extends Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {filteredProjects: props.projects};
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let projectList: Project[] = [];
        const searchString = e.target.value.toLowerCase();

        projectList = this.props.projects.filter((project: Project) => {
            const nameMatch = this.buildProjectTitle(project).toLowerCase().includes(searchString);
            const descriptionMatch = (project.description ? project.description : '').toLowerCase().includes(searchString);

            return nameMatch || descriptionMatch;
        });

        this.setState({filteredProjects: projectList})
    }

    buildProjectTitle = (project: Project): string => {
        return `#${project.id!} ${project.name}`;
    }

    public render(): JSX.Element {
        const items: JSX.Element[] = [];
        for (const project of this.state.filteredProjects) {
            const projectTitle = this.buildProjectTitle(project);
            items.push(
                <li key={project.id}>
                    <Link to={`/project/${project.id}`}>{projectTitle}</Link>
                    <Link to={`/project/${project.id}/edit`}>🖋️</Link>
                </li>);
        }

        return (
            <Fragment>
                <Input onChange={this.handleChange} />
                <ul>
                    {items}
                </ul>
            </Fragment>
        );
    }
}

export default ProjectList;
