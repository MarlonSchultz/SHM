import React from 'react';
import { Stakeholder } from '../../../actions/stakeholder';
import StakeholderList from './StakeholderList';
import { shallow } from 'enzyme';

describe('StakeholderList', () => {
    it('renders without crashing', () => {
        const stakeholders = new Array<Stakeholder>();
        const project = {
            id: 1,
            name: 'Test',
        };
        let onUpdate = () => {};

        shallow(<StakeholderList stakeholders={stakeholders} project={project} onUpdate={onUpdate} />);
    });

    it('renders 2 items', () => {
        const project = {
            id: 1,
            name: 'Test',
        };

        let onUpdate = () => {};

        const stakeholders = [
            {
                id: 1,
                name: 'Eckbert',
                company: 'Macrohard',
                role: 'Know-It-All',
                attitude: 'könnte besser sein',
                projectId: 1,
            },
            {
                id: 2,
                name: 'Louise',
                company: 'Macrohard',
                role: 'Entscheiderin',
                attitude: 'Macht ihr mal',
                projectId: 1,
            },
        ];

        const container = shallow(
            <StakeholderList stakeholders={stakeholders} project={project} onUpdate={onUpdate} />
        );

        expect(container.find('li').length).toBe(2);
        expect(container.contains('#1 Eckbert')).toBe(true);
        expect(container.contains('#2 Louise')).toBe(true);
    });
});
