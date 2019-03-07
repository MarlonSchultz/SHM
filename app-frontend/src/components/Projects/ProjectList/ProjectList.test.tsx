import { shallow } from 'enzyme';
import React from 'react';
import ProjectList from './ProjectList';
import { Project } from 'actions/projects';

describe('ProjectList', () => {

    it('renders without crashing', () => {
        const projects = new Array<Project>();
    
        const container = shallow(<ProjectList projects={projects} />);
    });
    
    
    it('renders 2 items', () => {
        const projects = [
            {id:1, name: 'Eins'},
            {id:2, name: 'Zwei'},
        ];

        const container = shallow(<ProjectList projects={projects} />);

        expect(container.find('li').length).toBe(2);
        expect(container.contains('Eins')).toBe(true);
        expect(container.contains('Zwei')).toBe(true);
    });
});
