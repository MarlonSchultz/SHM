import { Project } from 'actions/projects';
import Input from 'components/Base/Input/Input';
import { useAddProject, useGetProjects } from 'hooks/projects';
import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import ProjectInputWithHooks from '../ProjectInput/ProjectInputWithHooks';
import ProjectListWithHooks from '../ProjectList/ProjectListWithHooks';

function ProjectsOverviewWithHooks(): JSX.Element {

    return (
        <>
            <ProjectInputWithHooks
                onSubmit={(project?: Pick<Project, 'name' | 'description'>) => {
                    if (project) {
                        const a = useAddProject({...project});
                    }
                }}
            />
            <ProjectListWithHooks />
        </>
    );
}

export default ProjectsOverviewWithHooks;
