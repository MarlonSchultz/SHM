import React, { Component } from 'react';

type Props = {
    onChange(e: any): void,
}

class Input extends Component<Props> {
    render() {
        return (
            <input type="text" placeholder="Search" onChange={this.props.onChange}>
                {this.props.children}
            </input>
        );
    }
}

export default Input;
