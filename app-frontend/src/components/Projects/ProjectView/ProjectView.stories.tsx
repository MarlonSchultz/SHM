import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ProjectView from './ProjectView';

let project = {'id': 1, 'name': 'Eins', 'description': 'Das Erste'};

storiesOf('ProjectView', module)
    .add('default', () => <ProjectView project={project} match={{}} onUpdate={action('onUpdate')} />);