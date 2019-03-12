import React from 'react';
import StakeholderDetailTooltip from "./StakeholderDetailTooltip";
import {shallow} from "enzyme";

describe('StakeholderDetailTooltip', () => {
    it('renders without crashing', () => {
        const stakeholder = {
            'id': 1,
            'name': 'Eckbert',
            'company': 'Macrohard',
            'role': 'Know-It-All',
            'attitude': 'also ich würde das so machen',
            'projectId': 1,
        };

        const container = shallow(<StakeholderDetailTooltip stakeholder={stakeholder}/>);
    });

    it('renders the stakeholder', () => {
        const stakeholder = {
            'id': 1,
            'name': 'Eckbert',
            'company': 'Macrohard',
            'role': 'Know-It-All',
            'attitude': 'also ich würde das so machen',
            'projectId': 1,
        };

        const container = shallow(<StakeholderDetailTooltip stakeholder={stakeholder}/>);

        expect(container.find('p').length).toBe(4);
        expect(container.contains('Eckbert')).toBe(true);
        expect(container.contains('Macrohard')).toBe(true);
        expect(container.contains('Know-It-All')).toBe(true);
        expect(container.contains('also ich würde das so machen')).toBe(true);
    });
});