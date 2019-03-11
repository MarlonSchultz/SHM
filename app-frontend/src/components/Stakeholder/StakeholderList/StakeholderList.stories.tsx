import React from 'react';
import {storiesOf} from "@storybook/react";
import {MemoryRouter} from "react-router";
import StakeholderList from "./StakeholderList";

let stakeholderList = [
    {
        'id': 1,
        'name': 'Eckbert',
        'company': 'Macrohard',
        'role': 'Know-It-All',
        'attitude': 'könnte besser sein',
        'projectId': 1
    },
    {
        'id': 2,
        'name': 'Louise',
        'company': 'Macrohard',
        'role': 'Entscheiderin',
        'attitude': 'Macht ihr mal',
        'projectId': 1
    },
];

storiesOf('StakeholderList', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('default', () => <StakeholderList stakeholders={stakeholderList}/>);