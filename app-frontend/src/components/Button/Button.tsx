import React, { Component } from 'react';

interface Props {
    onClick(e: React.MouseEvent<HTMLButtonElement>): void;
}

class Button extends Component<Props> {
    public render(): JSX.Element {
        return (
            <button onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

export default Button;
