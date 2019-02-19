import React from 'react';
import { storiesOf } from '@storybook/react';
import App from './App';
import * as AppStoryNote from './AppStoryNote.md';
import {MemoryRouter} from "react-router";

storiesOf('App', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
  .add('default', () => <App />, {notes: "{ markdown: AppStoryNote }",});