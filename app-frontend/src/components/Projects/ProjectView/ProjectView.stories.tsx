import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ProjectView from './ProjectView';
import { MemoryRouter } from 'react-router';

let project = { id: 1, name: 'Eins', description: 'Das Erste' };

storiesOf('ProjectView', module)
    .addDecorator((story) => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
    .add('default', () => <ProjectView project={project} onUpdate={action('onUpdate')} />);
