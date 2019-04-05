import { Project } from 'actions/projects';
import Input from 'components/Base/Input/Input';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    projects: Project[];
}

interface State {
    filteredProjects: Project[];
    filter?: string;
}

class ProjectList extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = { filteredProjects: props.projects };
    }

    public componentDidUpdate(prevProps: Props, prevState: State): void {
        if (prevState.filter !== this.state.filter || prevProps.projects.length !== this.props.projects.length) {
            this.filterProjects(this.state.filter);
        }
    }

    public filterProjects = (filterWord?: string) => {
        if (!filterWord || filterWord === '') {
            this.setState({ filteredProjects: this.props.projects });
            return;
        }

        let projectList: Project[] = [];
        const searchString = filterWord.toLowerCase();

        projectList = this.props.projects.filter((project: Project) => {
            const nameMatch = this.buildProjectTitle(project)
                .toLowerCase()
                .includes(searchString);
            const desc = (project.description ? project.description : '').toLowerCase();
            const descriptionMatch = desc.includes(searchString);

            return nameMatch || descriptionMatch;
        });

        this.setState({ filteredProjects: projectList });
    };

    public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ filter: e.target.value });
    };

    public buildProjectTitle = (project: Project): string => `#${project.id} ${project.name}`;

    public render(): JSX.Element {
        const items: JSX.Element[] = [];
        for (const project of this.state.filteredProjects) {
            const projectTitle = this.buildProjectTitle(project);
            items.push(
                <li key={project.id}>
                    <Link to={`/project/${project.id}`}>{projectTitle}</Link>
                    <Link to={`/project/${project.id}/edit`}>🖋️</Link>
                </li>
            );
        }

        return (
            <Fragment>
                <Input onChange={this.handleChange} />
                <ul>{items}</ul>
            </Fragment>
        );
    }
}

export default ProjectList;
