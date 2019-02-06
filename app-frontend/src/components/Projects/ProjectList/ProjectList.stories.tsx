import React from 'react';
import { storiesOf } from '@storybook/react';
import ProjectList from './ProjectList';

storiesOf('ProjectList', module)
  .add('default', () => <ProjectList />)