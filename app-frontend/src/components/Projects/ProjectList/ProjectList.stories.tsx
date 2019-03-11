import React from 'react';
import { storiesOf } from '@storybook/react';
import ProjectList from './ProjectList';
import {MemoryRouter} from "react-router";

let projectList = [
  {'id': 1, 'name': 'Eins', 'description': 'Das Erste'},
  {'id': 2, 'name': 'Zwei', 'description': 'Das Zweite'},
];

storiesOf('ProjectList', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
  .add('default', () => <ProjectList projects={projectList}/>);
  