import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from './Tooltip';

describe('Tooltip', () => {
    it('renders without crashing', () => {
        shallow(<Tooltip component={<div>Ich bin ein Tooltip!</div>} position={'right'} />);
    });

    it('renders the tooltip', () => {
        const container = shallow(<Tooltip component={<div>Ich bin ein Tooltip!</div>} position={'right'} />);

        expect(container.find('span').length).toBe(2);
    });
});
