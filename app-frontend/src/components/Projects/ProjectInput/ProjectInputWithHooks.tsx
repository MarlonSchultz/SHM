import { Project } from 'actions/projects';
import { Field, Form, Formik, FormikActions } from 'formik';
import { useAddProject } from 'hooks/projects';
import React, { useState } from 'react';
import BEMHelper from 'react-bem-helper';
import './ProjectInput.scss';

const classes = new BEMHelper('ProjectInput');

function ProjectInputWithHooks(props: {
    submitLabel?: string;
    postSubmit?: (actions: FormikActions<Pick<Project, 'name' | 'description'>>) => void;
    project?: Pick<Project, 'name' | 'description'>;
}): JSX.Element {
    const { submitLabel = 'Save' } = props;
    const [form, setForm] = useState<Pick<Project, 'name' | 'description'>>({
        name: props.project ? props.project.name : '',
        description: props.project && props.project.description ? props.project.description : '',
    });

    const [submitForm, resourceState] = useAddProject(form);
    const onSubmit = (
        values: Pick<Project, 'name' | 'description'>,
        actions: FormikActions<Pick<Project, 'name' | 'description'>>
    ) => {
        setForm(values);
        submitForm().then((result) => {
            if (result && props.postSubmit) {
                props.postSubmit(actions);
            }
        });
    };

    return (
        <div {...classes()}>
            <Formik
                initialValues={form}
                onSubmit={onSubmit}
                render={() => (
                    <Form>
                        <div {...classes('row')}>
                            <Field type="text" name="name" placeholder="Project Name" {...classes('input')} />
                        </div>
                        <div {...classes('row')}>
                            <Field
                                type="text"
                                name="description"
                                placeholder="Project Description"
                                component="textarea"
                                {...classes('input', 'textarea')}
                            />
                        </div>
                        <div {...classes('row')}>
                            <button type="submit" disabled={resourceState.state === 'loading'}>
                                {submitLabel}
                            </button>
                        </div>
                    </Form>
                )}
            />
        </div>
    );
}

export default ProjectInputWithHooks;
