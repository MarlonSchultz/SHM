import React, { Component } from 'react';

type Props = {
    onClick(e: any): void,
}

class Input extends Component<Props> {
    render() {
        return (
            <input type="text" onClick={this.props.onClick}>
                {this.props.children}
            </input>
        );
    }
}

export default Button;
