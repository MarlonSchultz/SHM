import React, { Component } from 'react';
import { Stakeholder } from 'actions/stakeholder';

interface Props {
    stakeholder: Stakeholder;
}

class StakeholderDetailTooltip extends Component<Props> {
    public render(): JSX.Element {
        return (
            <div>
                <p>Name: {this.props.stakeholder.name}</p>
                <p>Company: {this.props.stakeholder.company}</p>
                <p>Role: {this.props.stakeholder.role}</p>
                <p>Attitude: {this.props.stakeholder.attitude}</p>
            </div>
        );
    }
}

export default StakeholderDetailTooltip;
