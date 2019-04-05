import React from 'react';
import StakeholderEdit from './StakeholderEdit';
import { shallow } from 'enzyme';

describe('StakeholderEdit', () => {
    it('renders without crashing', () => {
        shallow(<StakeholderEdit closeEditModal={() => {}} onSubmit={() => {}} />);
    });
});
