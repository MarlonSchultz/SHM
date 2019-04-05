import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import Tooltip from './Tooltip';

storiesOf('Tooltip', module)
    .addDecorator((story) => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
    .add('default', () => (
        <Tooltip component={<div>Ich bin ein Tooltip!</div>} position={'right'}>
            Hover me!
        </Tooltip>
    ));
