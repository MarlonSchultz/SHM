import React from 'react';
import StakeholderEdit from "./StakeholderEdit";
import {shallow} from "enzyme";

describe('StakeholderEdit', () => {
    it('renders without crashing', () => {
        const container = shallow(<StakeholderEdit closeEditModal={() => {}} onSubmit={() => {}}/>)
    });
});
