import React from 'react';
import { storiesOf } from '@storybook/react';
import App from './App';
import AppStoryNote from './AppStoryNote.md';

storiesOf('App', module)
  .add('default', () => <App />, {notes: { markdown: AppStoryNote },})