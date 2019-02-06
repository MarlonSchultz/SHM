import React, { Component } from 'react';
import { getProjects, Project } from 'actions/projects'

type State = {
    projects: Project[],
};

class ProjectList extends Component<any, State> {

    state = {
        projects: [],
    };

    componentDidMount() {
        getProjects().then((projects) => {
            this.setState({projects: projects});
        })
    }

    render() {

        let items : any = [];
        for(let project of this.state.projects) {
            console.log('project',project);
            items.push(<li key={project.id}>#{project.id} {project.name}</li>)
        }
        console.log('result', items);

        return (
            <ul>
                {items}
            </ul>
        );
    }
}

export default ProjectList;
