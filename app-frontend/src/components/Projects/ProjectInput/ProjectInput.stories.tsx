import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import ProjectInput from './ProjectInput';

storiesOf('ProjectInput', module)
  .add('default', () => <ProjectInput onSave={action('onSave')}/>);
