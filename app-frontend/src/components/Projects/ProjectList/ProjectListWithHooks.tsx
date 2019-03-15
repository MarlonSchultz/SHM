import { Project } from 'actions/projects';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useGetProjects } from 'hooks/projects';

interface Props {
    projects: Project[];
}

interface State {
    filteredProjects: Project[];
    filter?: string;
}

function ProjectListWithHooks() {
    const resourceState = useGetProjects();

    if (resourceState.state === 'error') {
        return <>error: {resourceState.error}</>;
    }

    if (
        resourceState.state === 'not_initialized' ||
        resourceState.state === 'loading'
    ) {
        return <>loading</>;
    }

    return resourceState.data.map(project => (
        <li key={project.id}>
            <Link to={`/project/${project.id}`}>{`#${project.id!} ${
                project.name
            }`}</Link>
            <Link to={`/project/${project.id}/edit`}>🖋️</Link>
        </li>
    ));
}

export default ProjectListWithHooks;
