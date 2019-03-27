import React from 'react';
import {storiesOf} from "@storybook/react";
import {MemoryRouter} from "react-router";
import StakeholderEdit from "./StakeholderEdit";

let project = {
    'id': 1,
    'name': 'Test Project'
};

let stakeholder = {
    'id': 1,
    'projectId': 1,
    'name': 'Test Stakeholder',
    'company': 'Test Company',
    'role': 'Test Role',
    'attitude': 'Test Attitude',
};

storiesOf('StakeholderEdit', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('default', () => <StakeholderEdit project={project} stakeholder={stakeholder} closeEditModal={() => {}} onSubmit={() => {}}/>);
