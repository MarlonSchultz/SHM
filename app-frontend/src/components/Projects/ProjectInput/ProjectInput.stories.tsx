import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ProjectInput from './ProjectInput';

storiesOf('ProjectInput', module)
  .add('default', () => <ProjectInput onSave={action('onSave')}/>);