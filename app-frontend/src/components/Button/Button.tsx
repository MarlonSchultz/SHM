import React, { Component } from 'react';

type Props = {
    onClick(e: any): void,
}

class Button extends Component<Props> {
    render() {
        return (
            <button onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

export default Button;
