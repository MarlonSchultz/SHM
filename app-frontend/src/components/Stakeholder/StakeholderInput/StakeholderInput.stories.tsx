import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import StakeholderInput from './StakeholderInput';
import { withKnobs, text } from '@storybook/addon-knobs';

const project = { id: 1, name: 'Eins', description: 'Das Erste' };

storiesOf('StakeholderInput', module)
    .addDecorator(withKnobs)
    .add('default', () => <StakeholderInput project={project} onSubmit={action('submit')} />)
    .add('prefill', () => {
        const name = text('Name', 'Wile E. Coyote');
        const company = text('Company', 'AMCE Inc');
        const role = text('Role', 'Product tester');
        const attitude = text('Attitude', 'Highly involved');

        return (
            <StakeholderInput
                project={project}
                name={name}
                company={company}
                role={role}
                attitude={attitude}
                onSubmit={action('submit')}
            />
        );
    });
