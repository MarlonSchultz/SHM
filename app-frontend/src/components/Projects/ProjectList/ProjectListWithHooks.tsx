import { Project } from 'actions/projects';
import Input from 'components/Base/Input/Input';
import { useGetProjects } from 'hooks/projects';
import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';

function ProjectListWithHooks(): JSX.Element {
    const resourceState = useGetProjects();
    const [searchword, setSearchwordState] = useState('');
    const setSearchword = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchwordState(e.currentTarget.value.toLowerCase());

    if (resourceState.state === 'error') {
        return <>error: {resourceState.error}</>;
    }

    if (resourceState.state === 'not_initialized' || resourceState.state === 'loading') {
        return <>loading</>;
    }

    const buildProjectTitle = (project: Project): string => `#${project.id} ${project.name}`;

    const items = resourceState.data.map((project: Project) => {
        let display = false;
        if (searchword === '') {
            display = true;
        }
        if (
            buildProjectTitle(project)
                .toLowerCase()
                .includes(searchword)
        ) {
            display = true;
        }
        if (project.description && project.description.toLowerCase().includes(searchword)) {
            display = true;
        }

        if (display) {
            return (
                <li key={project.id}>
                    <Link to={`/project/${project.id}`}>{buildProjectTitle(project)}</Link>
                    <Link to={`/project/${project.id}/edit`}>🖋️</Link>
                </li>
            );
        }
    });

    return (
        <Fragment>
            <Input onChange={setSearchword} />
            <ul>{items}</ul>
        </Fragment>
    );
}

export default ProjectListWithHooks;
