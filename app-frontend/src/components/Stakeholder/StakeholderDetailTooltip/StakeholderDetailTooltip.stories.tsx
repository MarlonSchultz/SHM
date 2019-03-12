import React from 'react';
import {storiesOf} from "@storybook/react";
import {MemoryRouter} from "react-router";
import StakeholderDetailTooltip from "./StakeholderDetailTooltip";

let stakeholder = {
    'id': 1,
    'name': 'Eckbert',
    'company': 'Macrohard',
    'role': 'Know-It-All',
    'attitude': 'also ich würde das so machen',
    'projectId': 1,
};

storiesOf('StakeholderDetailTooltip', module)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ))
    .add('default', () => <StakeholderDetailTooltip stakeholder={stakeholder}/>);