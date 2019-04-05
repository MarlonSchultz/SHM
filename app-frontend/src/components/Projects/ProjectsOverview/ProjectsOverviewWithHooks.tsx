import { Project } from 'actions/projects';
import React from 'react';
import ProjectInputWithHooks from '../ProjectInput/ProjectInputWithHooks';
import { FormikActions } from 'formik';

function ProjectsOverviewWithHooks(): JSX.Element {
    return (
        <ProjectInputWithHooks
            postSubmit={(actions: FormikActions<Pick<Project, 'name' | 'description'>>) => {
                actions.resetForm();
            }}
        />
    );
}

export default ProjectsOverviewWithHooks;
