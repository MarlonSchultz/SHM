import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { ApiContext, ApiContextShape } from 'components/ApiContext';
import fetchMock from 'fetch-mock';
import React from 'react';
import ProjectInput from './ProjectInput';
import ProjectInputWithHooks from './ProjectInputWithHooks';

const apiContext: ApiContextShape = {
  api: 'https://apiserver',
};

storiesOf('ProjectInput', module)
  .add('default', () => <ProjectInput onSave={action('onSave')}/>)
  .add('hooks', () => {
    // test
    fetchMock.restore().post(
      'https://apiserver/projects',
      new Response('{}', {status: 201}),
    );

    return (
      <ApiContext.Provider value={apiContext}>
        <ProjectInputWithHooks postSubmit={action('onSubmit')} submitLabel="Create" />
      </ApiContext.Provider>
    );
  });
