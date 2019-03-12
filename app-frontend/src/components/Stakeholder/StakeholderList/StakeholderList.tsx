import {Stakeholder} from "actions/stakeholder";
import React, {Component, Fragment} from "react";
import Tooltip from "../../Base/Tooltip/Tooltip";
import StakeholderDetailTooltip from "../StakeholderDetailTooltip/StakeholderDetailTooltip";


interface Props {
    stakeholders: Stakeholder[];
}

interface State  {
    currentStakeholder?: Stakeholder;
}

class StakeholderList extends Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.state = {currentStakeholder: undefined};
    };

    buildStakeholderEntry = (stakeholder: Stakeholder): string => {
        return `#${stakeholder.id} ${stakeholder.name}`;
    };

    selectStakeholder = (stakeholder?: Stakeholder) => () => {
        this.setState({currentStakeholder: stakeholder});
    };

    public render(): JSX.Element {
        const items: JSX.Element[] = [];

        for (const stakeholder of this.props.stakeholders) {
            const stakeholderEntry = this.buildStakeholderEntry(stakeholder);

            items.push(
                <li key={stakeholder.id}>
                    <Tooltip component={<StakeholderDetailTooltip stakeholder={stakeholder}/>} position={'right'}>
                        <a onMouseEnter={this.selectStakeholder(stakeholder)} onMouseLeave={this.selectStakeholder(undefined)}>{stakeholderEntry}</a>
                    </Tooltip>
                    <a href={`/project/${stakeholder.projectId}/stakeholder/${stakeholder.id}/edit`}>🖋️</a>
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