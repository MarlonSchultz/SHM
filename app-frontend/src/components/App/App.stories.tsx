import { storiesOf, RenderFunction } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import App from './App';

storiesOf('App', module)
    .addDecorator((story: RenderFunction) => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('default', () => <App />, { notes: 'Basic App' });
