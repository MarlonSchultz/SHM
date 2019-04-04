import { storiesOf } from '@storybook/react';
import { ApiContext, ApiContextShape } from 'components/ApiContext';
import fetchMock from 'fetch-mock';
import React from 'react';
import { MemoryRouter } from 'react-router';
import ProjectList from './ProjectList';
import ProjectListWithHooks from './ProjectListWithHooks';

const projectList = [
  { id: 1, name: 'Eins', description: 'Das Erste' },
  { id: 2, name: 'Zwei', description: 'Das Zweite' },
];

const apiContext: ApiContextShape = {
  api: 'https://apiserver',
};

storiesOf('ProjectList', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('default', () => <ProjectList projects={projectList} />)
  .add('hooks', () => {
    fetchMock.restore().get(
      'https://apiserver/projects',
      new Promise(resolve => setTimeout(resolve, 800)).then(
        () => projectList,
      ),
    );
    return (
      <ApiContext.Provider value={apiContext}>
        <ProjectListWithHooks />
      </ApiContext.Provider>
    );
  });
