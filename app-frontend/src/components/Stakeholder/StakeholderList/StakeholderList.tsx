import {Stakeholder} from "../../../actions/stakeholder";
import React, {Component} from "react";
import {Link} from "react-router-dom";


interface Props {
    stakeholders: Stakeholder[];
}

class StakeholderList extends Component<Props> {

    buildStakeholderEntry = (stakeholder: Stakeholder): string => {
        return `#${stakeholder.id} ${stakeholder.name} | ${stakeholder.company} | ${stakeholder.role} | ${stakeholder.attitude}`
    };

    public render(): JSX.Element {
        const items: JSX.Element[] = [];

        for (const stakeholder of this.props.stakeholders) {
            const stakeholderEntry = this.buildStakeholderEntry(stakeholder);

            items.push(
                <li key={stakeholder.id}>
                    <Link to={`/project/${stakeholder.projectId}/stakeholder/${stakeholder.id}`}>{stakeholderEntry}</Link>
                    <Link to={`/project/${stakeholder.projectId}/stakeholder/${stakeholder.id}/edit`}>🖋️</Link>
                </li>
            );
        }

        return (
            <ul>
                {items}
            </ul>
        );
    }
}

export default StakeholderList;