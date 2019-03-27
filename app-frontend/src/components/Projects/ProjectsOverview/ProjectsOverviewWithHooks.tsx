import { Project } from 'actions/projects';
import Input from 'components/Base/Input/Input';
import { useAddProject, useGetProjects } from 'hooks/projects';
import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import ProjectInputWithHooks from '../ProjectInput/ProjectInputWithHooks';
import ProjectListWithHooks from '../ProjectList/ProjectListWithHooks';
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
