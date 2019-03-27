import StakeholderInput from "./StakeholderInput";
import {shallow} from "enzyme";
import React from 'react';

describe('StakeholderInput', () => {
    it('renders without crashing', () => {
        const project = {
            'id': 1,
            'name': "Projekt",
        };

        const onSubmit = () => {};

        const container = shallow(<StakeholderInput project={project} onSubmit={onSubmit}/>);
    });
});