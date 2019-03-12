import React from 'react';
import {Stakeholder} from "../../../actions/stakeholder";
import StakeholderList from "./StakeholderList";
import {shallow} from "enzyme";

describe('StakeholderList', () => {
    it('renders without crashing', () => {
        const stakeholders = new Array<Stakeholder>();

        const container = shallow(<StakeholderList stakeholders={stakeholders}/>);
    });

    it('renders 2 items', () => {
        const stakeholders = [
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

        const container = shallow(<StakeholderList stakeholders={stakeholders}/>);

        expect(container.find('li').length).toBe(2);
        expect(container.contains('#1 Eckbert | Macrohard | Know-It-All | könnte besser sein')).toBe(true);
        expect(container.contains('#2 Louise | Macrohard | Entscheiderin | Macht ihr mal')).toBe(true);
    });

});