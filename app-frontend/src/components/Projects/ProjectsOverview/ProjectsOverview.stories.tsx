import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { ApiContext, ApiContextShape } from 'components/ApiContext';
import fetchMock from 'fetch-mock';
import React from 'react';
import { MemoryRouter } from "react-router";
import ProjectsOverview from './ProjectsOverview';
import ProjectsOverviewWithHooks from './ProjectsOverviewWithHooks';

let projects = [
    {'id': 1, 'name': 'Eins', 'description': 'Das Erste'},
    {'id': 2, 'name': 'Zwei', 'description': 'Das Zweite'},
];

const apiContext: ApiContextShape = {
  api: 'https://apiserver',
};

storiesOf('ProjectsOverview', module)
    .addDecorator(story => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('default', () => <ProjectsOverview projects={projects} onSave={action('onSave')}/>)
    .add('hooks', () => {
      fetchMock.restore().get(
        'https://apiserver/projects',
        new Promise(resolve => setTimeout(resolve, 800)).then(
          () => projects,
        ),
      );
      return (
        <ApiContext.Provider value={apiContext}>
          <ProjectsOverviewWithHooks />
        </ApiContext.Provider>
      );
    });