import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ProjectsOverview from './ProjectsOverview';
import { MemoryRouter } from "react-router";


let projects = [
    {'id': 1, 'name': 'Eins', 'description': 'Das Erste'},
    {'id': 2, 'name': 'Zwei', 'description': 'Das Zweite'},
];

storiesOf('ProjectsOverview', module)
    .addDecorator(story => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('default', () => <ProjectsOverview projects={projects} onSave={action('onSave')}/>)