import {Stakeholder} from "actions/stakeholder";
import React, {Component, Fragment} from "react";
import Tooltip from "../../Base/Tooltip/Tooltip";
import StakeholderDetailTooltip from "../StakeholderDetailTooltip/StakeholderDetailTooltip";
import Modal from "../../Base/Modal/Modal";
import StakeholderEdit from "../StakeholderEdit/StakeholderEdit";
import {Project} from "actions/projects";
import './StakeholderList.scss';


interface Props {
    stakeholders: Stakeholder[];
    project: Project;
}

interface State  {
    tooltipStakeholder?: Stakeholder;
    modalStakeholder?: Stakeholder;
    showModal: boolean;
}

class StakeholderList extends Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.state = {
            tooltipStakeholder: undefined,
            modalStakeholder: undefined,
            showModal: false,
        };
    };

    buildStakeholderEntry = (stakeholder: Stakeholder): string => {
        return `#${stakeholder.id} ${stakeholder.name}`;
    };

    selectTooltipStakeholder = (stakeholder?: Stakeholder) => () => {
        this.setState({tooltipStakeholder: stakeholder});
    };

    openStakeholderEditModal = (stakeholder?: Stakeholder) => () => {
        this.setState({
            modalStakeholder: stakeholder,
            showModal: true,
        });
    };

    closeStakeholderEditModal = () => {
        this.setState({showModal: false});
    };

    public render(): JSX.Element {
        const items: JSX.Element[] = [];

        for (const stakeholder of this.props.stakeholders) {
            const stakeholderEntry = this.buildStakeholderEntry(stakeholder);

            items.push(
                <div className="entry">
                    <li key={stakeholder.id}>
                        <Tooltip component={<StakeholderDetailTooltip stakeholder={stakeholder}/>} position={'right'}>
                            <a onMouseEnter={this.selectTooltipStakeholder(stakeholder)} onMouseLeave={this.selectTooltipStakeholder(undefined)}>{stakeholderEntry}</a>
                        </Tooltip>
                    </li>
                    <a className="button-edit" onClick={this.openStakeholderEditModal(stakeholder)}>🖋️</a>
                </div>
            );
        }

        return (
            <Fragment>
                <ul id="stakeholder-list">
                    {items}
                </ul>
                {this.state.showModal && <Modal>
                    <StakeholderEdit closeEditModal={this.closeStakeholderEditModal} project={this.props.project} stakeholder={this.state.modalStakeholder}/>
                </Modal>}
            </Fragment>
        );
    }
}

export default StakeholderList;