import React, { Component } from 'react';
import BEMHelper from 'react-bem-helper';
import './ProjectInput.scss';

interface Props {
    name?: string;
    description?: string;
    onSave: (name: string, description?: string) => void;
    buttonLabel?: string;
}

interface DefaultProps {
    buttonLabel: string;
}

export interface ProjectInputState {
    name: string;
    description?: string;
    missingName: boolean;
}

const classes = new BEMHelper('ProjectInput');

class ProjectInput extends Component<Props, ProjectInputState> {
    public static defaultProps: DefaultProps = {
        buttonLabel: 'Create',
    };

    public constructor(props: Props) {
        super(props);
        this.state = {
            name: props.name ? props.name : '',
            description: props.description,
            missingName: false,
        };
    }

    public create = () => {
        this.setState({ missingName: this.state.name === '' });

        if (this.state.name !== '') {
            this.props.onSave(this.state.name, this.state.description);
        }
    };

    public handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (event.target.name) {
            case 'name':
                this.setState({ name: event.target.value, missingName: event.target.value === '' });
                break;
            case 'description':
                this.setState({ description: event.target.value });
                break;
        }
    };

    public render(): JSX.Element {
        return (
            <div {...classes()}>
                <div {...classes('row')}>
                    <input
                        placeholder="Project Name"
                        name="name"
                        onChange={this.handleChange}
                        value={this.state.name}
                        {...classes('input', ['text', this.state.missingName ? 'error' : ''])}
                    />
                </div>
                <div {...classes('row')}>
                    <textarea
                        name="description"
                        placeholder="Projekt Beschreibung"
                        onChange={this.handleChange}
                        value={this.state.description}
                        {...classes('input', 'textarea')}
                    />
                </div>
                <div {...classes('row')}>
                    <button onClick={this.create} {...classes('button')}>
                        {this.props.buttonLabel}
                    </button>
                </div>
            </div>
        );
    }
}

export default ProjectInput;
