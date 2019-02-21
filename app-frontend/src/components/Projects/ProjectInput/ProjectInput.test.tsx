import React from 'react';
import {shallow} from 'enzyme';
import ProjectInput from './ProjectInput';

it('renders without crashing', () => {
    const container = shallow(<ProjectInput onSave={() => {}} />);

    expect(container.find('button').text()).toBe('Create');
    expect(container.find('input').length).toBe(1);
    expect(container.find('textarea').length).toBe(1);
});

it('Button has right text', () => {
    const container = shallow(<ProjectInput buttonLabel="Test" onSave={() => {}} />);

    expect(container.find('button').text()).toBe('Test');
    expect(container.find('input').length).toBe(1);
    expect(container.find('textarea').length).toBe(1);
});

it('input and clicked', () => {
    let callback = jest.fn();

    const container = shallow(<ProjectInput onSave={callback} />);
    
    let title = container.find('input');
    title.simulate('change', { target: { name: 'name', value: 'Titletext' } } );
    
    let text = container.find('textarea');
    text.simulate('change', { target: { name: 'description', value: 'Text' } } );

    expect(container.state().name).toBe('Titletext');
    expect(container.state().description).toBe('Text');

    container.find('button').simulate('click');
    
    expect(callback.mock.calls.length).toBe(1);

    expect(callback.mock.calls[0][0]).toBe('Titletext');
    expect(callback.mock.calls[0][1]).toBe('Text');
});

it('clicked', () => {
    let callback = jest.fn();

    const container = shallow(<ProjectInput onSave={callback} />);
    container.setState({
        name: 'A',
        description: 'B',
    });

    container.find('button').simulate('click');
    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.calls[0][0]).toBe('A');
    expect(callback.mock.calls[0][1]).toBe('B');
});

it('clicked without name', () => {
    let callback = jest.fn();

    const container = shallow(<ProjectInput onSave={callback} />);
    container.setState({
        name: '',
        description: 'B',
        missingName: false,
    });

    container.find('button').simulate('click');
    expect(callback.mock.calls.length).toBe(0);
    expect(container.state().missingName).toBe(true);
});