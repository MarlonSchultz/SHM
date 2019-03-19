import { Project } from 'actions/projects';
import { DraftStakeholder } from 'actions/stakeholder';
import { Field, Form, Formik, FormikActions } from 'formik';
import React, { Component } from 'react';
import BEMHelper from 'react-bem-helper';

interface Props {
    project: Project;
    name?: string;
    company?: string;
    role?: string;
    attitude?: string;
    isUpdate?: boolean;
    onSubmit: (values: DraftStakeholder, actions: FormikActions<DraftStakeholder>) => void;
}

interface DefaultProps {
    isUpdate: boolean;
}

const classes = new BEMHelper('StakeholderInput');

class StakeholderInput extends Component<Props> {

    public static defaultProps: DefaultProps = {
        isUpdate: false,
    };

    public render(): JSX.Element {
        let { name, company, role, attitude } = this.props;

        if (!name) {
            name = '';
        }
        return (
            <div {...classes()}>
                <h1>{this.props.isUpdate ? 'Update' : 'Add'} Stakeholder for "{this.props.project.name}"</h1>
                <Formik
                    initialValues={{name, company, role, attitude, projectId: this.props.project.id!}}
                    onSubmit={this.props.onSubmit}
                    render={() => (
                        <Form>
                            <Field
                                type="text"
                                name="name"
                                label="Stakeholder Name"
                                placeholder="Stakeholder"
                            />
                            <Field
                                type="text"
                                name="company"
                                label="Company Name"
                                placeholder="Company"
                            />
                            <Field
                                type="text"
                                name="role"
                                label="Role"
                                placeholder="Role"
                            />
                            <Field
                                type="text"
                                name="attitude"
                                label="Attiude"
                                placeholder="Attiude"
                            />
                            <button type="submit">
                                {this.props.isUpdate ? 'Update': 'Create'}
                            </button>
                        </Form>
                    )}
                />
            </div>
        );
    }
}

export default StakeholderInput;
