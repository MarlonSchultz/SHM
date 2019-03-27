import {DraftStakeholder, Stakeholder} from "actions/stakeholder";
import React, {Component} from "react";
import StakeholderInput from "../StakeholderInput/StakeholderInput";
import {Project} from "actions/projects";
import './StakeholderEdit.scss';
import {FormikActions} from "formik";

interface Props {
    project?: Project
    stakeholder?: Stakeholder;
    closeEditModal: () => void;
    onSubmit: (values: DraftStakeholder, actions: FormikActions<DraftStakeholder>) => void
}

class StakeholderEdit extends Component<Props> {
    public constructor(props: Props) {
        super(props);
    }

    public render(): JSX.Element {
        const {project, stakeholder} = this.props;
        if (!project || !stakeholder) {
            return (<div>No data</div>);
        }

        return (
            <div className="modal">
                <div className="backdrop">
                    <div className="button-close">
                        <a onClick={this.props.closeEditModal}>X</a>
                    </div>
                    <div className="input">
                        <StakeholderInput
                            project={project}
                            onSubmit={this.props.onSubmit}
                            name={stakeholder.name}
                            company={stakeholder.company}
                            role={stakeholder.role}
                            attitude={stakeholder.attitude}
                            isUpdate={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default StakeholderEdit;