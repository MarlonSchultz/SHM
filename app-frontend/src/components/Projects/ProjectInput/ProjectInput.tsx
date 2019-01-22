import React, { Component } from 'react';
import { addProject } from 'actions/projects'

type Props = {
    name?: string,
    description?: string
}

type State = {
    name: string,
    description?: string
}

class ProjectInput extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            name: props.name ? props.name : '',
            description: props.description,
        };
    }

    create = () => {
        if (addProject(this.state.name, this.state.description)) {
            this.setState({description: '', name: ''})
        }
    }

    handleChange = (event: any) => {
        switch(event.target.name) {
            case 'name':
                this.setState({name: event.target.value});
            break;
            case 'description':
                this.setState({description: event.target.value});
                break;
        }
    }

    render() {
        return (
            <div>
                <div>
                    <input name="name" onChange={this.handleChange} value={this.state.name}/>
                </div>
                <div>
                    <textarea name="description" onChange={this.handleChange} value={this.state.description} />
                </div>
                <div>
                    <button onClick={this.create}>Create</button>
                </div>
            </div>
        );
    }
}

export default ProjectInput;