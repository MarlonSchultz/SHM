import {DraftStakeholder, Stakeholder, updateStakeholder} from "actions/stakeholder";
import React, {Component, Fragment} from "react";
import Tooltip from "../../Base/Tooltip/Tooltip";
import StakeholderDetailTooltip from "../StakeholderDetailTooltip/StakeholderDetailTooltip";
import Modal from "../../Base/Modal/Modal";
import StakeholderEdit from "../StakeholderEdit/StakeholderEdit";
import {Project} from "actions/projects";
import './StakeholderList.scss';
import {FormikActions} from "formik";


interface Props {
    stakeholders: Stakeholder[];
    project: Project;
    onUpdate: (projectId: number) => void;
}

interface State {
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

    public updateStakeholder = (values: DraftStakeholder, actions: FormikActions<DraftStakeholder>): void => {
        if (this.state.modalStakeholder) {
            const projectId = this.state.modalStakeholder.projectId;
            updateStakeholder({...this.state.modalStakeholder, ...values}).then((result: boolean) => {
                if (result) {
                    actions.resetForm({
                        projectId: projectId,
                        name: values.name,
                        company: values.company,
                        attitude: values.attitude,
                        role: values.role,
                    });

                    this.props.onUpdate(projectId);
                }
            });
        }
    };

    public render(): JSX.Element {
        const items: JSX.Element[] = [];

        for (const stakeholder of this.props.stakeholders) {
            const stakeholderEntry = this.buildStakeholderEntry(stakeholder);

            items.push(
                <div key={`div-${stakeholder.id}`} className="entry">
                    <li key={stakeholder.id}>
                        <Tooltip component={<StakeholderDetailTooltip stakeholder={stakeholder}/>} position={'left'}>
                            <a onMouseEnter={this.selectTooltipStakeholder(stakeholder)}
                               onMouseLeave={this.selectTooltipStakeholder(undefined)}>{stakeholderEntry}</a>
                        </Tooltip>
                    </li>
                    <a key={`edit-${stakeholder.id}`} className="button-edit" onClick={this.openStakeholderEditModal(stakeholder)}>🖋️</a>
                </div>
            );
        }

        return (
            <Fragment>
                <ul id="stakeholder-list">
                    {items}
                </ul>
                {this.state.showModal && <Modal>
                    <StakeholderEdit closeEditModal={this.closeStakeholderEditModal}
                                     onSubmit={this.updateStakeholder}
                                     project={this.props.project}
                                     stakeholder={this.state.modalStakeholder}
                    />
                </Modal>}
            </Fragment>
        );
    }
}

export default StakeholderList;